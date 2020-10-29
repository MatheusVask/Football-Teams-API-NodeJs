const express = require('express');
const {uuid, isUuid} = require('uuidv4');

const app = express();
app.use(express.json())

const teams = []

function titleCase(string){
  var sentence = string.toLowerCase().split(" ");
  for(var i = 0; i< sentence.length; i++){
    sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
  }
  sentence.join(" ");
  return sentence;
}

function validId(request, response, next){
  const {id} = request.params;
  if(!isUuid(id)){
    return response.status(400).json({error:"Invalid ID inserted"});
  }
  return next();
}

app.get('/teams', (request,response)=>{
  const {name} = request.query;
  const results = name ? teams.filter(team => team.name.toUpperCase().includes(name.toUpperCase())) : teams;
  return response.json(results);
})

app.post('/teams', (request,response)=>{
  const {name, titles} = request.body;
  const [nameTitle] = titleCase(name)
  const team = {id: uuid(), name: nameTitle, titles};
  teams.push(team);
  return response.json(team);
})

app.put('/teams/:id', validId, (request, response)=>{
  const {id} = request.params;
  const {name, titles} = request.body;
  const [nameTitle] = titleCase(name)

  const teamIndex = teams.findIndex(team => team.id === id);
  if(teamIndex < 0){
    return response.status(404).json({error:"Value ID not found"});
  }

  const team = {id, name: nameTitle, titles};
  teams[teamIndex] = team;
  return response.json(team)
})

app.delete('/teams/:id', validId, (request, response)=>{
  const {id} = request.params;
  const teamIndex = teams.findIndex(team => team.id === id);
  if(teamIndex < 0){
    return response.status(404).json({error: "Value ID not found"});
  }
  teams.splice(teamIndex, 1);
  return response.status(204).send()
})

app.listen(3333)