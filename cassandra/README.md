### Setup

1. Create a docker network

```
docker network create api_net

```

2. Run cassandra as a docker container with a mounted data directory and limiting to 4 cpu cores
```
docker run --rm --cpus="3" --network api_net --name cassandra -d -p 9042:9042 -v /home/install/databases/docker/cassandra:/var/lib/cassandra  cassandra:3.11.6
```

3. Attach to the postgres container to run psql commands

```
docker exec -it cassandra /bin/bash
cqlsh
CREATE KEYSPACE testkeyspace WITH REPLICATION={'class': 'SimpleStrategy', 'replication_factor': 1};
USE testkeyspace;
create table users(id int PRIMARY KEY, user_name text, user_details text, user_details2 text, user_details3 text);
```

4. Build and run the node application

```
docker build --tag cassandracrud:1.0.0 .
docker run --rm --cpus="5" --network api_net --name cassandracrud -d -p 9009:9009 cassandracrud:1.0.0
```

5. Run the jmx file with jmeter

### Otheruseful commands
docker stats to see docker container utilization
To check row count - copy testkeyspace.users (id) to '/dev/null'

### Perf testing
The jmter script is available in the perftest folder and it can be used to test the addUser and readUser endpoints

