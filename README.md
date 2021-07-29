## Running the project

Set environment variables as follows:

`export DOTNET_POSTGRES_CON_STRING="host=postgres;database=guesswork;password=Password12!;username=postgres"`

`export DOTNET_TOKEN_SECRET="THISISTHETOKENSECRET"`

Run `docker-compose up` from the root directory, this will start the database and the web app.
To do development, stop the web container `docker-compose stop web`, and start the development server `dotnet watch run` from the `src/Web` directory

Run pgadmin tool to query db manually with

`docker run -d -e PGADMIN_DEFAULT_EMAIL="anders.kfd@gmail.com" -e PGADMIN_DEFAULT_PASSWORD="anderskofoed" -p 1111:80 dpage/pgadmin4`

### Build new image version

From `src/Web`-dir run:
`docker build -t sp1nakr/disclive:0.50 . ; docker push sp1nakr/disclive:0.50`

### Deploy

From `infrastructure`-dir. Update docker-compose with new version and run `docker-compose up -d disclive`
`docker --context prod compose up -d postgres`

### Backup

`docker exec -t postgres pg_dumpall -c -U postgres > dump_`date +%d-%m-%Y"_"%H_%M\_%S`.sql`

### Restore

`cat your_dump.sql | docker exec -i your-db-container psql -U postgres`

# ELK

https://github.com/deviantony/docker-elk

## Ignore files:

git update-index --assume-unchanged <file>
git update-index --no-assume-unchanged <file>
infrastructure/kibana/config/kibana.yml
infrastructure/logstash/config/logstash.yml
infrastructure/logstash/pipeline/logstash.conf
infrastructure/variables.env
