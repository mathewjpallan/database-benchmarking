### Setup

1. Create a docker network

```
docker network create api_net

```

2. Run elastic as a docker container with a mounted data directory and limiting to 3 cpu cores
```
docker run --rm --cpus="3" --network api_net --name elastic -d -p 9200:9200 -e "discovery.type=single-node" -v /home/install/databases/docker/elastic:/usr/share/elasticsearch/data  docker.elastic.co/elasticsearch/elasticsearch:7.8.0

```

3. Attach to the database container to run commands

```
docker exec -it elastic /bin/bash
curl http://localhost:9200/_cluster/health?pretty //to check health of the cluster
curl localhost:9200/_cat/indices?v  //to check indices

The index would get autocreated when the addUser test is run
```

4. Build and run the node application

```
docker build --tag elasticcrud:1.0.0 .
docker run --rm --cpus="5" --network api_net --name elasticcrud -d -p 9009:9009 elasticcrud:1.0.0
```

5. Run the jmx file with jmeter

### Otheruseful commands
docker stats to see docker container utilization
To delete all docs in index
curl -XPOST 'http://localhost:9200/testindex/_delete_by_query' -d '{
    "query" : { 
        "match_all" : {}
    }
}'

To delete all docs in the test index
curl -X POST "localhost:9200/testindex/_delete_by_query?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match_all": {
    }
  }
}
'

### Perf testing
The jmter script is available in the perftest folder and it can be used to test the addUser and readUser endpoints

