const ex = require('express');
const application = ex();
const fs = require('fs');
application.get("/stations", (request, response) => {
 const stations = fs.readFileSync('./stations.json');
 response.json(JSON.parse(stations));
})

application.listen(8081, () => console.log("Good"))