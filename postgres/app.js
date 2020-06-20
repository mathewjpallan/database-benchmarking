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
    const Pool = require('pg').Pool
    const pool = new Pool({
        user: 'postgres',
        host: 'postgres',
        database: 'testdb',
        password: 'postgres',
        port: 5432,
        max: 15
    });
    
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }))

    app.listen(9009, () => {
        console.log("Server running on port 9009");
    });

    app.get("/v1/readUser/:id", (req, res, next) => {
        let id = req.params.id;
        pool.query('select * from users where users.id = $1', [id], (error, results) => {
            if (error) {
                console.log(error)
                throw error
            }
            if (results.rowCount > 0)
                res.status(200).send(`User retrieved : ${results.rows[0].id} ${results.rows[0].user_name} ${results.rows[0].user_details}`)
            else 
                res.status(404)
        })
    });

    app.post('/v1/addUser', function (req, res) {
        let data = req.body
        pool.query('INSERT INTO users (id, user_name, user_details, user_details2, user_details3) VALUES ($1, $2, $3, $4, $5)', [data.id, data.userName, data.userDetails, data.userDetails, data.userDetails], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).json({user_id : data.id})
        })
    })

} 