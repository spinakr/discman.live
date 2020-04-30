# Build image
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS builder

RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
RUN apt-get install -y nodejs

WORKDIR /
# Copy files
COPY . ./build
RUN ls


WORKDIR /build
RUN dotnet publish --configuration Release -o out 

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /bin
COPY --from=builder /build/out .
ENV ASPNETCORE_URLS="http://*:80"
ENTRYPOINT ["dotnet", "Web.dll"]