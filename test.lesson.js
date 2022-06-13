 const { append } = require("express/lib/response");
const fs = require('fs.promises');
const res = require("express/lib/response");
const ex = require('express');
const { param } = require("express/lib/request");
const application = ex();

application.use(ex.json())

application.get('/stations', (request, response) => {
    fs.readFile('./stations.json').then(stations => {
        response.json(JSON.parse(stations));
    })
})

application.post('/stations', (req, res) => {
    console.log('here')
    const newStation = req.body;
    console.log(newStation);
    fs.readFile('./stations.json').then(data => {
        const stationArray = JSON.parse(data);
        stationArray.push(newStation);
        fs.writeFile('./stations.json', JSON.stringify(stationArray)).then(() =>{
            res.sendStatus(200);
        })
    }).catch(err => console.error(err));
});


application.delete('/stations/:id', (req, res) => {    
    fs.readFile('./stations.json').then(data => {
        const stationArray = JSON.parse(data);
        console.log("id" ,req.params.id);
        const newArray = stationArray.filter(s => s.id != req.params.id);
        fs.writeFile('./stations.json', JSON.stringify(newArray)).then(() =>{
            res.sendStatus(200);
        })
    }).catch(err => console.error(err));
});
application.listen(8085, () => console.log("Good Lesson"));

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
