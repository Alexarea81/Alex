 const { append } = require("express/lib/response");
const fs = require('fs.promises');
const res = require("express/lib/response");
const ex = require('express');
const application = ex();

application.use(ex.json())

application.get('/stations', (request, response) => {
    fs.readFile('./stations.json').then(stations => {
        response.json(JSON.parse(stations));
    })
})

application.post('/stations', (req, res) => {
    const newStation = req.body;
    fs.readFile('./stations.json').then(data => {
        const stationArray = JSON.parse(data);
        stationArray.push(newStation);
        fs.writeFile('./stations.json', JSON.stringify(stationArray)).then(() =>{
            res.sendStatus(200);
        })
    }).catch(err => console.error(err));
});
   
application.listen(8085, () => console.log("Good Lesson"));