## Running the project
Set environment variables as follows:

`export DOTNET_POSTGRES_CON_STRING="host=postgres;database=guesswork;password=Password12!;username=postgres"`

`export DOTNET_TOKEN_SECRET="THISISTHETOKENSECRET"`

Run `docker-compose up` from the root directory, this will start the database and the web app.
To do development, stop the web container `docker-compose stop web`, and start the development server `dotnet watch run` from the `src/Web` directory

Run pgadmin tool to query db manually with 

`docker run -d -e PGADMIN_DEFAULT_EMAIL="anders.kfd@gmail.com" -e PGADMIN_DEFAULT_PASSWORD="anderskofoed" -p 1111:80 dpage/pgadmin4`
