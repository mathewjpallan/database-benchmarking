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
    var redis = require('redis');
    const redisClient = redis.createClient(6379, 'redis');
    
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

        redisClient.get(id, (err, redisValue) => {
            if (redisValue != null) {
                res.status(200).send('User retrieved :' + JSON.parse(redisValue))
            } else {
                res.status(404).send('NotFound')
            }
        })
    });

    app.post('/v1/addUser', function (req, res) {
        let data = req.body
        redisClient.set(data.id, JSON.stringify(data));
        res.status(200).json({user_id : data.id});
    })

} 