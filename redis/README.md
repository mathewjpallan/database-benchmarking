### Setup

1. Create a docker network

```
docker network create api_net
```

2. Run redis as a docker container and limiting to 3 cpu cores
```
docker run --rm --cpus="3" --network api_net --name redis -d -p 6379:6379 redis:6.0.5-alpine
```

3. Build and run the node application

```
docker build --tag rediscrud:1.0.0 .
docker run --rm --cpus="5" --network api_net --name rediscrud -d -p 9009:9009 rediscrud:1.0.0
```

5. Run the jmx file with jmeter

### Otheruseful commands
docker stats to see docker container utilization

The following commands need to be run on redis-client
info keyspace //to see number of keys

### Perf testing
The jmter script is available in the perftest folder and it can be used to test the addUser and readUser endpoints