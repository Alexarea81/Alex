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

    connection.query('DELETE FROM station WHERE id = ?',
      [req.params.id], (err, data) => {
        if (err) {
           console.error(err);
        }
        res.sendStatus(200);
   });
});


application.put('/stations/:id', (req, res) => { 

    connection.query('UPDATE station SET address = ?, status = ? WHERE id = ?',
      [req.body.address, req.body.status, req.params.id], (err, data) => {
        if (err) {
           console.error(err);
        }
        res.sendStatus(200);
    });
 });



application.listen(8085, () => console.log("Good Lesson"));