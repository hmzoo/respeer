var socketio = require('socket.io');
var server = require('./lib/server');
var siddb = require('./lib/siddb.js');

var io = socketio.listen(server);

io.on('connection', function(client) {
    console.log('Client connected', client.id);

    client.on('disconnect', function() {
      siddb.forgetSid(client.id).then(function(result){
        io.sockets.emit("leave", {name: result});
      });

    });

    client.on('join', function() {
        var s = io.sockets.connected[client.id];
        siddb.newUser(client.id).then(function(result) {
            s.emit('id', {name: result});
            io.sockets.emit("join", {name: result});
        });

    });

    client.on('peerSignal', function(data) {

        siddb.fromTo(client.id, data.to).then(function(result) {

            io.sockets.connected[result.to].emit("peerSignal", {
                from: result.from,
                signal: data.signal
            });
        });

    });

    client.on('message', function(message) {
        console.log('message ', client.id, message);
    });
});
