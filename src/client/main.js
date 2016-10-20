var ReactDOM = require('react-dom');
var React = require('react');
var socket = require('socket.io-client')();
var Peer = require('simple-peer');
var App = require('./views/app.jsx');

Respeer = require('./respeer.js');

Respeer.app = ReactDOM.render(
    <App/>, document.getElementById('app'));

Respeer.datas.onUpdated = function(tab) {
    Respeer.app.setDatas(tab);
}

socket.on('connect', function() {
    console.log('Connected successfully to the socket.io server.');
    socket.emit('join');
});

socket.on('disconnect', function() {
    console.log('Socket.io server disconnected ');
});

socket.on('id', function(d) {
    Respeer.userName = d.name;
    Respeer.app.setUserName(Respeer.userName);
});

socket.on('join', function(d) {
    Respeer.newUser(d.name);
});

socket.on('leave', function(d) {
    Respeer.delUser(d.name);
});
/*

socket.on('hello', function(d) {
    Respeer.newUser(d.sid, d.name, "");
    if (d.sid != Respeer.sid) {
        console.log(Respeer.getPeer(d.sid));
        if (!Respeer.getPeer(d.sid)) {
            console.log("no peer");
            var p = new Peer({initiator: true, trickle: false});
            p.on('error', function(err) {
                console.log('error', err)
            });
            p.on('signal', function(data) {
                console.log('SIGNAL', JSON.stringify(data));
                socket.emit('helloFrom', {
                    from: Respeer.userName,
                    to: d.sid,
                    content: JSON.stringify(data)
                });

            });
            p.on('connect', function() {
                console.log('CONNECT');
                p.send('whatever ' + Math.random());
            })

            p.on('data', function(data) {
                console.log('data: ' + data);
            })
            Respeer.updateUser(d.sid, {p: p});
        }

    }
});



socket.on('helloFrom', function(d) {
    if (Respeer.userExists(d.sid)) {
      if (Respeer.getPeer(d.sid)) {
        Respeer.getPeer(d.sid).signal(JSON.parse(d.content));
      }
        Respeer.updateUser(d.sid, {content: d.content});
    } else {
        Respeer.newUser(d.sid, d.from, d.content);
        console.log("new peer")
        var p = new Peer({initiator: false, trickle: false});
        p.on('error', function(err) {
            console.log('error', err)
        });
        p.on('connect', function() {
            console.log('CONNECT');
            p.send('whatever ' + Math.random());
        });

        p.on('data', function(data) {
            console.log('data: ' + data);
        });
        p.on('signal', function(data) {
            console.log('SIGNAL', JSON.stringify(data));
            socket.emit('helloFrom', {
                from: Respeer.userName,
                to: d.sid,
                content: JSON.stringify(data)
            });

        });
        p.signal(JSON.parse(d.content));
        Respeer.updateUser(d.sid, {p: p});

    }

});
  */
