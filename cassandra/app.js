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
    const cassandra = require('cassandra-driver');
    const client = new cassandra.Client({
      contactPoints: ['cassandra'],
      localDataCenter: 'datacenter1',
      keyspace: 'testkeyspace'
    });
     
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
        const query = 'SELECT * FROM users WHERE id = ?';
        let id = req.params.id;

        // Set the prepare flag in your queryOptions
        client.execute(query, [id], { prepare: true }, function (err, results) {                     
            if (err) {
                console.log(err)
                throw err
            }
            var user = results.first();
            if (user)
                res.status(200).send(`User retrieved : ${user.id} ${user.user_name} ${user.user_details}`)
            else 
                res.status(404).send('NotFound')
        })
    });

    app.post('/v1/addUser', function (req, res) {
        let data = req.body
        const query = 'INSERT INTO users (id, user_name, user_details, user_details2, user_details3) VALUES (?, ?, ?, ?, ?)';
        const params = [data.id, data.userName, data.userDetails, data.userDetails, data.userDetails];
        client.execute(query, params, { prepare: true }, function (err) {
            if (err) {
                console.log(err)
                throw err
            }
            res.status(200).json({user_id : data.id});
        });
    })

} 