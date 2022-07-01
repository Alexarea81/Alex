 const { append } = require("express/lib/response");
const fs = require('fs.promises');
const res = require("express/lib/response");
const ex = require('express');
const { param } = require("express/lib/request");
const application = ex();
const cors = require('cors');

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'alex',
    password: '1234',
    database: 'newradalarm'
});

connection.connect(function(error) {
    if (error) {
        console.error(error);
    } else {
        console.log('Successfully connected to DB');
    }
});


application.use(ex.json());

application.use(cors());
application.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

application.get('/stations', (req, res) => {
    connection.query('SELECT * FROM station', (err, data) => {
         if (err) {
            console.error(err);
         }
         res.send(data);
    });
    });

application.post('/stations', (req, res) => {
    connection.query('INSERT INTO station (address, status) values (?, ?)',
      [req.body.address, req.body.status], (err, data) => {
    if (err) {
        console.error(err);
    }
    connection.query('SELECT * FROM station WHERE id = ?',
      [data.insertId], (err, data) => {
        if (err) {
            console.error(err);  
        }
        res.send(data);
      });    
   });
}); 


application.delete('/stations/:id', (req, res) => {    
    fs.readFile('./stations.json').then(data => {
        const stationArray = JSON.parse(data);
        console.log("id", req.params.id);
        const newArray = stationArray.filter(s => s.id != req.params.id);
        fs.writeFile('./stations.json', JSON.stringify(newArray)).then(() =>{
            res.sendStatus(200);
        })
    }).catch(err => console.error(err));
});

application.get('/stations/:id', (request, response) => {
    fs.readFile('./stations.json').then(stations => {
        response.json(JSON.parse(stations).filter(s => s.id == request.params.id));

    });
});


application.put('/stations/:id', (req, res) => {    
    console.log(req.body)
    fs.readFile('./stations.json').then(data => {
        const arrayFromFile = JSON.parse(data);
        const resultArray = arrayFromFile.map(
        s => s.id == req.params.id ? {...s, ...req.body } : s
        )
        fs.writeFile('./stations.json', JSON.stringify(resultArray)).then(() =>{
            res.sendStatus(200);
        })
    }).catch(err => console.error(err));
});




application.listen(8085, () => console.log("Good Lesson"));