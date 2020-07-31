using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;

namespace Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            ConfigureLogger();

            try
            {
                Log.Information("Starting up");
                CreateHostBuilder(args).Build().Run();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Application start-up failed");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        private static void ConfigureLogger()
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json")
                .AddEnvironmentVariables()
                .Build();
            Serilog.Debugging.SelfLog.Enable(Console.Error);
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
                .MinimumLevel.Override("Marten", LogEventLevel.Warning)
                .WriteTo.Console()
                .Enrich.WithProperty("ApplicationName", "discman.live")
                .WriteTo.Http("http://logstash:7000")
                .MinimumLevel.Information()
                .CreateLogger();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); })
                .UseSerilog();
    }
}