# DB-benchmarking

This is a benchmarking of popular databases to get a view of the vanilla write and read TPS that is possible against these databases.

NodeJS is used to expose a write and read API for some of the popular datastores. Each individual folder has basic documentation explaining how the test can be run for each datastore.

v1/addUser POST API is used to benchmark the writes with the following payload - 
```
{
 "id": ${counter},
 "userName": "testuser${counter}",
 "userDetails": "A really long list of user details. This is just a random string to ensure test data in the column."
}
```
/v1/readUser/:id GET API is used to benchmark the reads

## Test Approach
- The perftest folder contains a jmx file that has the above mentioned APIs. 
- The database & the nodejs APIs were run as docker containers. The database was limited to 3 cores and the API was limited to 5 cores as can be seen in the individual documentation. 
- Both the containers were running on the same machine along with the Jmeter (ver 5.3) instance.
- Machine had 6 cores (Intel(R) Core(TM) i7-8850H CPU @ 2.60GHz) with 2 threads per core and 32 GB of RAM
- None of the databases/API containers was using more than 1 GB of RAM during the test although there were no limits applied

## Test observations
The test observations are the TPS/avg response time while writing 20 million records to the databases. The reads were done against the 20 million records that were added during the write benchmarking

| Database | Operation | Request Per Second | Avg Reponse Time (millisecond) | Observations
| --- | --- | --- | --- | --- |
| Postgres 12 | Write | 7500 TPS | 13 | NodeJS and DB utilizing all allocated cores
| Postgres 12 | Read | 10500 TPS | 9 | NodeJS and DB utilizing all allocated cores
| ElasticSearch 7.8 | Write  | 6000 TPS | 16 | NodeJS and DB utilizing all allocated cores  
| ElasticSearch 7.8 | Read (Get by document ID) | 12000 TPS | 8 | NodeJS and DB utilizing all allocated cores  
| Cassandra 3.11.6 | Write  | 14000 TPS | 7 | NodeJS and DB utilizing all allocated cores  
| Cassandra 3.11.6 | Read  | 10500 TPS | 9 | NodeJS and DB utilizing all allocated cores  
| Scylla 4.0 | Write  | 15500 TPS | 5 | NodeJS and DB utilizing all allocated cores  
| Scylla 4.0 | Read  | 18000 TPS | 5 | NodeJS and DB utilizing all allocated cores  
| Redis 6.0 | Write  | 24000 TPS | 4 | NodeJS utilizing all allocated cores, Redis was using .5 core of 3 allocated  
| Redis 6.0 | Read  | 28000 TPS | 2 | NodeJS utilizing all allocated cores, Redis was using .5 core of 3 allocated