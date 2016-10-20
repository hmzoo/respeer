var socketio = require('socket.io');
var server = require('./lib/server');
var siddb= require('./lib/siddb.js');

var io = socketio.listen(server);

io.on('connection', function(client) {
    console.log('Client connected', client.id);

    client.on('disconnect', function() {
      io.sockets.emit("bye",{sid:client.id});
    });

    client.on('join', function(message) {
        console.log('message ', client.id, message);
        var s = io.sockets.connected[client.id];
        siddb.newUser(client.id).then(function(result){
          s.emit('id',{name:result} );
          io.sockets.emit("join",{name:result});
        });

    });

    client.on('peerSignal',function(data){
      

      });



    client.on('message', function(message) {
        console.log('message ', client.id, message);
    });
});
