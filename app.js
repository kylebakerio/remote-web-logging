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

// function sendEmail3() {
// 	const util = require('util');
// 	const exec = util.promisify(require('child_process').exec);
// 	async function hackedCurl() {
// 	  try {
// 	      const { stdout, stderr } = await exec(`curl -s --user 'api:3bec278d4353f0ed2c5263306b182dd4-a09d6718-14ce1b87' https://api.eu.mailgun.net/v3/bossxrussellathletic.com/messages -F from='Excited User <mailgun@bossxrussellathletic.com>' -F to=finesttype+curlInNodeInHeroku@gmail.com -F to=nobar@example.com -F subject='Hello from node' -F text='Testing some Mailgun shit.'`);

// 	      console.log('stdout:', stdout);
// 	      console.log('stderr:', stderr);
// 	  } catch (err) {
// 	     console.error(err);
// 	  };
// 	};
// 	hackedCurl();
// }

// sendEmail3()

// io.on('connection', (socket) => {
//   socket.on('console', (msg) => {
//   	io.emit('sharedConsole',msg)
//   	msg = JSON.parse(msg)

//   	// console[msg.method](...(msg.args))

//   	console.group('sharing '+msg.method)
//   	console[msg.method](...(msg.args))
//   	console.log(msg.trace)
//   	console.groupEnd()
//     // console.log('message: ', msg);
//   });
// });

// server.listen(3000, () => {
//   console.log('listening on *:3000');
// });








// var express = require('express');
// var app = express();

// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// const http = require('http');
// const server = http.createServer(app);
// const io = require('socket.io')(server);
// // const io = require('socket.io')(app);


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');


// app.use((req, res) => {
// 	console.log("request", req.path)
// 	// this is absurd, but app.get isn't working, will move this into there later...
// 	// res.send('<h1>Hello world</h1>');
// })
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// // app.use('/', indexRouter);
// // app.use('/users', usersRouter);

// app.get('/', (req, res) => {
// 	console.log("/")
//   res.send('<h1>Hello world</h1>');
// });

// app.get('/1', (req, res) => {
// 	console.log("/")
//   res.send('<h1>Hello world</h1>');
// });

// io.on('connection', (socket) => {
//   console.log('a user connected');
// });

// server.listen(3000, () => {
//   console.log('listening on *:3000');
// });

module.exports = app;

