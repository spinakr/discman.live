# Build image
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS builder

ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1

RUN apt-get update -yq 
RUN apt-get install curl gnupg -yq 

RUN curl -sL https://deb.nodesource.com/setup_16.x |  bash -
RUN apt-get install -y nodejs build-essential

WORKDIR /
# Copy files
COPY . ./build
RUN ls


WORKDIR /build
RUN ls
RUN dotnet publish ./src/Web/Web.csproj --configuration Release -o out 
WORKDIR /build/ClientApp
RUN npm install
RUN npm run build
RUN cp -r build ../out/ClientApp

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /bin
COPY --from=builder /build/out .
ENV ASPNETCORE_URLS="http://*:80"
ENTRYPOINT ["dotnet", "Web.dll"]