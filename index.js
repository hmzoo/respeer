var socketio = require('socket.io');
var server = require('./lib/server');

var io = socketio.listen(server);

io.on('connection', function(client) {
    console.log('Client connected', client.id);

    client.on('disconnect', function() {
      io.sockets.emit("bye",{sid:client.id});
    });

    client.on('join', function(message) {
        console.log('message ', client.id, message);
        var s = io.sockets.connected[client.id];
        var rname=(Math.floor(Math.random() * 90000) + 10000).toString();
        s.emit('id',{name:rname,sid:client.id} );
        io.sockets.emit("hello",{name:rname,sid:client.id});

    });
    client.on('helloFrom', function(data) {

        io.sockets.connected[data.to].emit('helloFrom',{from:data.from,content:data.content,sid:client.id});

    });

    client.on('message', function(message) {
        console.log('message ', client.id, message);

    });
});
