using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using NServiceBus;
using Serilog;
using Serilog.Events;
using Web.Infrastructure;
using EnvironmentName = Microsoft.Extensions.Hosting.EnvironmentName;

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
            Serilog.Debugging.SelfLog.Enable(Console.Error);
            var logConfig = new LoggerConfiguration()
                .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
                .MinimumLevel.Override("Marten", LogEventLevel.Warning)
                .WriteTo.Console()
                .Enrich.WithProperty("ApplicationName", "discman.live")
                .MinimumLevel.Information();

            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            var enableElk = Environment.GetEnvironmentVariable("ENABLE_ELK");
            var isDevelopment = environment == Environments.Development;
            if (!isDevelopment && enableElk is not null && enableElk == "true")
            {
                logConfig.WriteTo.Http("http://logstash:7000");
            }

            Log.Logger = logConfig.CreateLogger();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); })
                .UseSerilog()
                .UseNServiceBus(context => NServiceBusConfiguration.ConfigureEndpoint());
    }
}