echo "Building Discman.Classic"
dotnet build Discman.Classic.sln 

echo "Building Discman Web Client App"
cd src/Web/ClientApp
npm install
npm run build
cd ../..

echo "Building Discman Web 2.0"
dotnet build Discman.Next.sln
dotnet test Discman.Next.sln

