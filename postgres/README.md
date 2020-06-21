### Setup

1. Create a docker network

```
docker network create api_net

```

2. Run postgres as a docker container with a mounted data directory and limiting to 3 cpu cores
```
docker run --rm --cpus="3" --network api_net --name postgres -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 -v /home/install/databases/docker/postgres:/var/lib/postgresql/data  postgres:12.3-alpine
```

3. Attach to the postgres container to run psql commands

```
docker exec -it postgres /bin/bash
su postgres
psql
create database testdb;
\c testdb
create table users(id serial primary key, user_name varchar(100), user_details varchar(500), user_details2 varchar(500), user_details3 varchar(500));

Other commands
\list #to list the databases
```

4. Build and run the node application

```
docker build --tag postgrescrud:1.0.0 .
docker run --rm --cpus="5" --network api_net --name postgrescrud -d -p 9009:9009 postgrescrud:1.0.0
```

5. Run the jmx file with jmeter

### Otheruseful commands
docker stats to see docker container utilization

SELECT sum(numbackends) FROM pg_stat_database; to find number of connections to postgres

select count(1) from users; // To see count of users; However the below query is much faster though to get an approx if you have too many rows

SELECT reltuples::BIGINT AS estimate FROM pg_class WHERE relname='users';

### Perf testing
The jmter script is available in the perftest folder and it can be used to test the addUser and readUser endpoints

