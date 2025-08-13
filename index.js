import express from 'express';
import bodyParser from 'body-parser';
const app = express()
// create application/json parser
const jsonParser = bodyParser.json()
const port = 3000
app.use(express.static('public'));
import {getRecords,searchRecords,updateRecord,removeRecord,getProjectName,getMetadata, addRecord} from "./structure/project-starter.js";

app.get('/records', (req, res) => {
  res.json(getRecords());
});

app.get('/projectName', (req, res) => {
  res.send(getProjectName());
});

app.get('/metadata', (req, res) => {
  res.json(getMetadata());
});

app.get('/records/:id', (req, res) => {
  const result=searchRecords(req.params.id);
  if(!result.status){
    res.statusCode=404;
  }
  res.json(result.msg);
});

app.post('/records', jsonParser, (req, res) => {
  const result=addRecord(req.body);
  if(result.status){
    res.statusCode=201;
  }
  else{
    res.statusCode=422;
  }
  res.json(result.msg);
});

app.patch('/records/:id', jsonParser, (req, res) => {
  const result=updateRecord(req.params.id,req.body);
  if(result.status){
    res.statusCode=200;
  }
  else{
    res.statusCode=422;
  }
  res.json(result.msg);
});

app.delete("/records/:id",(req, res)=>{
  const result=removeRecord(req.params.id);
  if(result.status) {
    res.statusCode=204;
    res.send('{}');
  }
  else{
    res.statusCode=404;
    res.json(result.msg);
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

