var Peer = require('simple-peer');

module.exports = function(init, evt) {
    var self = this;

    self.p = new Peer({initiator: init, trickle: false});

    self.close = function() {
        self.p.removeListener('error', self.close);
        self.p.removeListener('signal', self.onSignal)
        self.p.removeListener('connect', self.onConnect);
        self.p.removeListener('close', self.close);
        self.p.removeListener('end', self.close);
        self.p.removeListener('data', self.onData);
        self.p.destroy();
        self.onClose();
    };
    self.onClose = evt.onClose
        ? evt.onClose
        : function() {
            console.log(" peer closed");
        };
    self.onConnect = evt.onConnect
        ? evt.onConnect
        : function() {
            console.log(" peer connected");
        };
    self.onSignal = evt.onSignal
        ? evt.onSignal
        : function(data) {
            console.log("peer signal");
        };
    self.signal = function(data) {
        self.p.signal(data);
    };
    self.onData = function(data) {
        try {
            data = JSON.parse(data)
        } catch (err) {
            console.error(err.message)
        }
        console.log(data);
        if ((data.type == 'msg') && data.data) {
            self.onMsg(data.data);
        }
    };
    self.p.on('error', self.close);

    self.p.on('signal', self.onSignal);
    self.p.on('connect', self.onConnect);
    self.p.on('close', self.close);
    self.p.on('end', self.close);
    self.p.on('data', self.onData);
    self.onMsg = evt.onMsg
        ? evt.onMsg
        : function(content) {
            console.log("msg " + content);
        };
    self.sendMsg = function(data) {
        self.p.send(JSON.stringify({type: 'msg', data: data}));
    };

}
