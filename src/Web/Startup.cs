using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using SendGrid.Extensions.DependencyInjection;
using Web.Common.Behaviours;
using Web.Courses;
using Web.Infrastructure;
using Web.Leaderboard;
using Web.Matches;
using Web.Tournaments;
using Web.Users;

namespace Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostEnvironment hostEnvironment)
        {
            Configuration = configuration;
            _env = hostEnvironment;
        }

        public IConfiguration Configuration { get; }
        private readonly IHostEnvironment _env;

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddHostedService<UpdateCourseRatingsWorker>();
            services.AddHostedService<UpdateInActiveRoundsWorker>();
            services.AddHostedService<LeaderboardWorker>();
            services.AddHostedService<UpdateCourseLocationsWorker>();
            services.AddHostedService<UserCleanupWorker>();
            services.AddHostedService<ResetPasswordWorker>();
            services.AddMediatR(Assembly.GetExecutingAssembly());

            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(UnhandledExceptionBehaviour<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(PerformanceBehaviour<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            services.AddAutoMapper(Assembly.GetExecutingAssembly());

            services.AddControllersWithViews(options => options.Filters.Add(new ApiExceptionFilter()));
            services.AddHttpContextAccessor();

            services.AddSendGrid(options =>
            {
                options.ApiKey = Configuration.GetValue<string>("SENDGRID_APIKEY");
            });


            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/build"; });

            services.ConfigureMarten(Configuration, _env);
            services.AddSingleton<LeaderboardCache>();
            services.AddSingleton<UserStatsCache>();
            services.AddSingleton<TournamentCache>();
            services.AddSingleton<CourseStatsCache>();

            var secret = Configuration.GetValue<string>("TOKEN_SECRET");
            services.AddAuthentication(x =>
                {
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(x =>
                {
                    x.RequireHttpsMetadata = false;
                    x.SaveToken = true;
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                    x.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];

                            // If the request is for our hub...
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) &&
                                (path.StartsWithSegments("/roundHub")))
                            {
                                // Read the token out of the query string
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddSignalR();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }


            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<RoundsHub>("/roundHub");
                endpoints.MapControllers();
            });



            // var adminAppHostName = env.IsDevelopment() ? "admin.localhost" : "admin.discman.live";
            // app.MapWhen(o => o.Request.Host.Host == adminAppHostName &&
            //                  o.User.Claims.Single(c => c.Type == ClaimTypes.Name).Value == "kofoed",
            //             adminApp =>
            // {
            //     adminApp.UseSpa(spa =>
            //           {
            //               spa.Options.SourcePath = "AdminApp";

            //               if (env.IsDevelopment())
            //               {
            //                   spa.UseReactDevelopmentServer(npmScript: "start");
            //               }
            //           });
            // });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });

        }
    }
}