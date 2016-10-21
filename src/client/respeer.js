var Mdb = require('./mdb.js');
var MPeer = require('./mpeer.js');

var ctl = {
    datas: new Mdb(),
    userName: '',
    sid: '',

    select: function(name) {
        this.app.select(name);
    },
    userExists: function(name) {
        return this.datas.exists(name);
    },
    newUser: function(name) {
        this.datas.add(name, {
            name: name,
            linked: false,
            messages: [],
            content: ''
        })
    },
    delUser: function(name) {
        this.datas.del(name);
    },
    updateUser: function(name, data) {
        this.datas.set(name, data);
    },
    getUser: function(name) {
        if (this.userExists(name)) {
            return this.datas.get(name);
        } else {
            return null;
        }
    },
    getPeer: function(name) {
        if (this.userExists(name)) {
            return this.datas.get(name).p;
        } else {
            return null;
        }
    },
    sendMsg: function(name, text) {
        if (this.getPeer(name)) {
            this.newMsg(name, text);
            this.getPeer(name).sendMsg(text);
        }
    },
    newMsg: function(name, text) {
        console.log(text);
        if (this.getUser(name)) {
            var m = this.getUser(name).messages.concat([text]);

            this.updateUser(name, {messages: m});

        }
    },
    initPeer: function(name,init) {
      
        if (!this.getPeer(name)) {

            var evt={}
            evt.onConnect = function() {
                Respeer.updateUser(name, {linked: true});
            };
            evt.onClose = function() {
              Respeer.updateUser(name, {linked: false});
              if (Respeer.userExists(name)) {
                  delete Respeer.datas.get(name).p;
              }
            };
            evt.onSignal = function(data) {
                Respeer.socket.emit('peerSignal', {
                    to: name,
                    signal: data
                });
            };
            evt.onMsg = function(content) {
                Respeer.newMsg(name, content);
            };
            var p = new MPeer(init,evt);
            this.updateUser(name, {p: p});
        }

    }

};

module.exports = ctl;
