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
    sendMsg: function(name,data) {
        if (this.getPeer(name)) {
          data.user=this.userName;
          var m = this.datas.get(name).messages.concat([data]);
          this.updateUser(name, {messages: m});
          this.getPeer(name).sendMsg(data);
        }
    },
    newMsg: function(name, data) {
        if (this.getUser(name)) {
            data.user=name;
            var m = this.datas.get(name).messages.concat([data]);
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
              console.log("closed");
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
            evt.onMsg = function(data) {
              console.log(data);
                Respeer.newMsg(name, data);
            };
            var p = new MPeer(init,evt);
            this.updateUser(name, {p: p});
        }

    }

};

module.exports = ctl;
