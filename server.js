var http = require('http');
var express = require('express');
var Duplex = require('stream').Duplex;
var livedb = require('livedb');
var liveDbMongo = require('livedb-mongo');
var socketio = require('socket.io');
var browserChannel = require('browserchannel').server;
var sharejs = require('share');

var app = express();
var backend;

backend = livedb.client(liveDbMongo('mongodb://localhost/angular-sharejs-example?auto_reconnect', {safe: true}));

share = sharejs.server.createClient({
    backend: backend
});


var numClients = 0;


app.use(express.static('app'));
app.use(express.static(sharejs.scriptsDir));

app.use(browserChannel({
    webserver: app,
    sessionTimeoutInterval: 5000
}, function(client) {
    var stream;
    numClients++;
    stream = new Duplex({
        objectMode: true
    });
    stream._write = function(chunk, encoding, callback) {
        console.log('s->c ', JSON.stringify(chunk));
        if (client.state !== 'closed') {
            client.send(chunk);
        }
        return callback();
    };
    stream._read = function() {};
    stream.headers = client.headers;
    stream.remoteAddress = stream.address;
    client.on('message', function(data) {
        console.log('c->s ', JSON.stringify(data));
        return stream.push(data);
    });
    stream.on('error', function(msg) {
        return client.stop();
    });
    client.on('close', function(reason) {
        stream.push(null);
        stream.emit('close');
        numClients--;
        return console.log('client went away', numClients);
    });
    stream.on('end', function() {
        return client.close();
    });
    return share.listen(stream);
}));


app.use(function(err, req, res, next) {
    console.error(err.stack || (new Error(err)).stack);
    res.send(500, 'Something broke!');
});

app.get('/racer/:roomId', function(req, res, next) {
});

/// SOCKET IO
// I'm only adding socket.io in here to make sure it doesn't bump into browserchannel and sharejs,
// since I use socket.io for other purposes in other applications.
// Feel free to remove it.  It doesn't add any value to this example application.

// Create a new HTTP server
var server = http.createServer(app);


// Create a new Socket.io server
var io = socketio.listen(server);


// Intercept Socket.io's handshake request
io.use(function(socket, next) {
    next(null, true);
});

// Add an event listener to the 'connection' event
io.on('connection', function(socket) {
    console.log('*** io.on: connection.');
    //console.log(socket);
});

/// END SOCKET IO

var port = process.env.PORT || 3000;
//http.createServer(app).listen(port, function() {
// socket.io requires us to do a server.listen instead of creating a new server
// when using express.  The server was already created by socket.io
server.listen(port, function() {
    console.log('Go to http://localhost:' + port);
});
