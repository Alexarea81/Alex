var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var append = require("express/lib/response").append;
var fs = require('fs.promises');
var res = require("express/lib/response");
var ex = require('express');
var param = require("express/lib/request").param;
var application = ex();
var cors = require('cors');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'alex',
    password: '1234',
    database: 'newradalarm'
});
connection.connect(function (error) {
    if (error) {
        console.error(error);
    }
    else {
        console.log('Successfully connected to DB');
    }
});
application.use(ex.json());
application.use(cors());
application.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
application.get('/stations', function (req, res) {
    connection.query('SELECT * FROM station', function (err, data) {
        if (err) {
            console.error(err);
        }
        res.send(data);
    });
});
application.post('/stations', function (req, res) {
    connection.query('INSERT INTO station (address, status) values (?, ?)', [req.body.address, req.body.status], function (err, data) {
        if (err) {
            console.error(err);
        }
        connection.query('SELECT * FROM station WHERE id = ?', [data.insertId], function (err, data) {
            if (err) {
                console.error(err);
            }
            res.send(data);
        });
    });
});
application.delete('/stations/:id', function (req, res) {
    fs.readFile('./stations.json').then(function (data) {
        var stationArray = JSON.parse(data);
        console.log("id", req.params.id);
        var newArray = stationArray.filter(function (s) { return s.id != req.params.id; });
        fs.writeFile('./stations.json', JSON.stringify(newArray)).then(function () {
            res.sendStatus(200);
        });
    }).catch(function (err) { return console.error(err); });
});
application.get('/stations/:id', function (request, response) {
    fs.readFile('./stations.json').then(function (stations) {
        response.json(JSON.parse(stations).filter(function (s) { return s.id == request.params.id; }));
    });
});
application.put('/stations/:id', function (req, res) {
    console.log(req.body);
    fs.readFile('./stations.json').then(function (data) {
        var arrayFromFile = JSON.parse(data);
        var resultArray = arrayFromFile.map(function (s) { return s.id == req.params.id ? __assign(__assign({}, s), req.body) : s; });
        fs.writeFile('./stations.json', JSON.stringify(resultArray)).then(function () {
            res.sendStatus(200);
        });
    }).catch(function (err) { return console.error(err); });
});
application.listen(8085, function () { return console.log("Good Lesson"); });
