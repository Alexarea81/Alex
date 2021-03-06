const { response } = require("express")


async function refreshStations() {
  var myRow = document.getElementById('row')
  myRow.innerHTML = ""

    let response = await fetch('http:localhost:8085/stations')
    let stations = await response.json()

    for (let i = 0; i < stations.length; i++) {    

     let tr = document.createElement("tr")
     let tdId = document.createElement("td")
     let tdAdress = document.createElement("td")
     let tdStatus = document.createElement("td")
     let tdButtonDelete = document.createElement('button')
     let tdButtonUpdate = document.createElement('button')

     tdButtonDelete.innerText='Delete'
     tdButtonDelete.style.color='red'
     tdButtonDelete.style.borderRadius='10px'
     tdButtonDelete.onclick = function() {myButton(stations[i].id)}

     tdButtonUpdate.innerText='Update'
     tdButtonUpdate.style.color='green'
     tdButtonUpdate.style.borderRadius='10px'
     tdButtonUpdate.onclick = function() { Update(stations[i])}

     tdId.innerText = stations[i].id 
     tdAdress.innerText = stations[i].adress
     tdStatus.innerText = stations[i].status 

     tr.appendChild(tdId)
     tr.appendChild(tdAdress)
     tr.appendChild(tdStatus)
     tr.appendChild(tdButtonDelete)
     tr.appendChild(tdButtonUpdate)
     myRow.appendChild(tr)}
    }
       

   function myButton(id) {fetch('http:localhost:8085/stations/' + id, {method: 'DELETE'}).then(res => refreshStations())}

    function Update(station) {

      document.forms['NewStation'].elements['id'].value = station.id
      document.forms['NewStation'].elements['adress'].value = station.adress
      document.forms['NewStation'].elements['status'].value = station.status
    } 



    function onUpdate() {
      const form = document.getElementById('NewStation')
      const formData = new FormData(form)
      let station = {}
    for (let [key, value] of formData.entries()) {
       station[key] = value}
    
    fetch('http:localhost:8085/stations/' + station.id, {
      method: 'PUT',
      body: JSON.stringify(station),
      headers: {'Content-Type': 'application/json'},
    }).then(response => {refreshStations()})
    
  }


  function createNewStation() {
    const form = document.getElementById("NewStation")
    const formData = new FormData(form)
    let resp = {}
    for (let [key, value] of formData.entries()) {
        resp[key] = value;
    }
    fetch("http:localhost:8085/stations", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(resp)
    }).then(res => { 
    });
    form.reset()
    refreshStations()
  }

    
  async function searchStation() {
    let response = await fetch('http:localhost:8085/stations')
    let stations = await response.json()
    const form = document.getElementById("SearchStation")
    const formData = new FormData(form)
    let result = document.getElementById('search-id').value
    var id = Number(result) 
    const station = stations.find( el => el.id == id)
    var tdId = document.querySelector('td')
    tdId.style.color = 'aqua'
    console.log(station)
    if (id == 0) {swal("Please enter a valid ID", "ID begins with '1' not '-' and not 'text'", "warning")}
     else if (!station) {swal("Not find ID", "Please enter a valid ID", "info")}
     form.reset()

   
    document.forms['NewStation'].elements['id'].value = station.id
    document.forms['NewStation'].elements['adress'].value = station.adress
    document.forms['NewStation'].elements['status'].value = station.status

  }