var ReactDOM = require('react-dom');
var React = require('react');
var socket = require('socket.io-client')();
var MPeer = require('./mpeer.js');
var App = require('./views/app.jsx');

Respeer = require('./respeer.js');
Respeer.socket = socket;

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
    console.log('user join');
    Respeer.newUser(d.name);
    if (d.name != Respeer.userName) {
        Respeer.initPeer(d.name, true);
    }
});

socket.on('leave', function(d) {
    Respeer.delUser(d.name);
});

socket.on('peerSignal', function(d) {
    //console.log("peerSignal",d,Respeer.getPeer(d.from));
    if (Respeer.getPeer(d.from)) {
        Respeer.getPeer(d.from).signal(d.signal);
    } else {
        if (!Respeer.getUser(d.from)) {
            Respeer.newUser(d.from);
        }
        Respeer.initPeer(d.from, false);
        Respeer.getPeer(d.from).signal(d.signal);
    }
});

var newPeer = function(name, init) {
    console.log("new peer", name, Respeer.getPeer(name), init);
    if (!Respeer.getPeer(name)) {

        var p = new Peer({initiator: init, trickle: false});
        p.on('error', function(err) {
            console.log('error', err)
        });
        p.on('signal', function(data) {
            socket.emit('peerSignal', {
                to: name,
                signal: data
            });

        });
        p.on('connect', function() {
            console.log('CONNECT');
            Respeer.updateUser(name, {linked: true});
            p.send('msg', "HELLO");
        });

        p.on('message', function(data) {
            Respeer.newMsg(name, data.toString());
            console.log('data: ' + data);
        })
        Respeer.updateUser(name, {p: p});
        console.log("getPeer", Respeer.getPeer(name));

    }
}
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
