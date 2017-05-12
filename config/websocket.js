var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var config = require('./config.json');

io.on('connection', function () { /* … */
});

server.listen(config.socket.PORT, function () {
    console.log('ws app listening on port 4000!');
});

console.log(io.sockets.clients())

module.exports = io;