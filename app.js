const express = require('express');
var cors = require('cors')
const app = express();
app.use(cors())

var path = require('path');


const http = require('http');
const server = http.createServer(app);
// const io = require('socket.io')(server);

app.rUtils = require('./redis-utils.js');


app.use(express.static(path.join(__dirname, 'public')));

app.options('*', cors()) // include before other routes

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/watch/:sessionId', (req,res) => {
    
})


module.exports = app;

