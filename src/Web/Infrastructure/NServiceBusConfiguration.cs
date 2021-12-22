using System;
using NServiceBus;

namespace Web.Infrastructure
{
    public static class NServiceBusConfiguration
    {
        public static EndpointConfiguration ConfigureEndpoint()
        {
            var endpointConfiguration = new EndpointConfiguration("discman.web");
            var transport = endpointConfiguration.UseTransport<RabbitMQTransport>();
            transport.UseConventionalRoutingTopology();
            transport.ConnectionString(Environment.GetEnvironmentVariable("DOTNET_RABBITMQ_CON_STRING"));

            endpointConfiguration.EnableInstallers();
            return endpointConfiguration;
        }
    }
}