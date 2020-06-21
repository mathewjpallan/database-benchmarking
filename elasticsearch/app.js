const cluster = require('cluster');

if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = 5;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
   
} else {
    const express = require("express");
    const app = express();
    const bodyParser = require('body-parser')
    const cors = require('cors')
    const { Client } = require('@elastic/elasticsearch')
    const client = new Client({ node: 'http://elastic:9200' })
     
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }))

    var server = app.listen(9009, () => {
        console.log("Server running on port 9009");
    });
    server.on('connection', function (socket) {
        console.log("New incoming connection")
        socket.setTimeout(200 * 1000);
    });

    app.get("/v1/readUser/:id", (req, res, next) => {
        let id = req.params.id;
        // There are multiple options here - to get by the document id or to search by the id attribute. The commented code below and the response send can be tried for document id get.
        // 1) Direct get by document id
        //    client.get({
        //     index: 'testindex',
        //     id: id
        // }, 
        // 2) Search by id   
        // client.search({
        //     index: 'testindex',
        //     body: {
        //         query: {
        //             bool: {
        //                 must: {
        //                     match: { "id": id }
        //                 }
        //             }
        //         },
        //     }
        // },
        // 3) Search by term
        client.search({
            index: 'testindex',
            body: {
                query: {
                    bool: {
                        filter: {
                            term: { "id.raw": id }
                        }
                    }
                },
            }
        }, 
        (err, result) => {
            if (err) {
                console.log(err)
                res.status(404).send('NotFound')
            } else {
                // The below is for the get by document id
                //res.status(200).send('User retrieved :' + JSON.stringify(result.body._source));
                //The below is for the search/filter
                res.status(200).send('User retrieved :' + JSON.stringify(result.body.hits.hits[0]._source));
            }
        })
    });

    app.post('/v1/addUser', function (req, res) {
        let data = req.body
        data['user_details2'] = data.userDetails
        data['user_details3'] = data.userDetails
        client.index({
            index: 'testindex',
            id: data.id,
            body: data
          }, (err, result) => {
            if (err) console.log(err)
            res.status(200).json({user_id : data.id});
          })
    })

} 