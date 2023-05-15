const express = require('express');
const http = require('http');
const WebSocket = require('ws');
let token = 102;
let currentToken = 'T-101';
const app = express();
const server = http.createServer();
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const rec_msg = message.toString('utf8');
    currentToken = rec_msg;
    wss.clients.forEach((client) => {
        client.send(rec_msg);
    });
  });
});
const path = require('path');
require('dotenv').config();
const {pool, connectToDatabase} = require('./config/connection');
connectToDatabase();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname , '/views'));
app.use("/assets", express.static(__dirname + "/assets"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.get('/', (req, res) =>{
    res.redirect('/token-dashboard');
})
app.get('/token-dashboard', async (req, res) =>{
  try{
    const query = 'SELECT * FROM users';
    const result = await pool.query(query);
    const arr = result.rows;
    res.render('dashboard', {arr, currentToken});
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
});
app.post('/token-dashboard',async (req, res) =>{
  const {name, phone} = req.body;
  let t1 = `T-${token}`;
  try{
    const query = `insert into users (name, phone, token) values ($1,$2,$3)`;
    await pool.query(query, [name, phone, t1])
    token++;
    res.redirect('/token-dashboard');
  }catch (error){
    console.log('Failed to insert : ', error);
    res.status(500).send('Failed to insert data');
  }
})
app.get('/current-token', (req, res)=>{
  res.render('client', {currentToken});
})
// app.post('/token-dashboard/next', (req,res) =>{
//   currentToken = req.body.currentToken;
//   res.redirect('/token-dashboard');
// });
const port = 3000
server.listen(8080, () => {
  console.log('WebSocket server is running on port 8080');
})
app.listen(port,console.log(`Server is running at http://localhost:${port}`));