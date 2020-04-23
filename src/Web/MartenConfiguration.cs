using Marten;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Web
{
    public static class MartenConfiguration
    {
        public static void ConfigureMarten(this IServiceCollection services, IConfiguration configuration, IHostEnvironment hostEnvironment)
        {
            var store = DocumentStore.For(_ =>
            {
                _.DatabaseSchemaName = $"guesswork_{hostEnvironment.EnvironmentName}";
                _.Connection(configuration.GetValue<string>("POSTGRES_CON_STRING"));

                _.CreateDatabasesForTenants(c =>
                {
                    c.ForTenant()
                        .CheckAgainstPgDatabase()
                        .WithOwner("postgres")
                        .WithEncoding("UTF-8")
                        .ConnectionLimit(-1);
                });

                _.AutoCreateSchemaObjects = AutoCreate.All;

            });

            services.AddSingleton<IDocumentStore>(store);
            services.AddScoped(sp => sp.GetService<IDocumentStore>().OpenSession());
        }
    }}