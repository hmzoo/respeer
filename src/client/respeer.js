var Mdb=require('./mdb.js');

var ctl = {
    datas: new Mdb(),
    userName:'',
    sid:'',

    select:function(name){
      this.app.select(name);
    },
    userExists:function(name){
      return this.datas.exists(name);
    },
    newUser:function(name){
      this.datas.add(name,{name:name,linked:false,messages:['test'],content:''})
    },
    delUser:function(name){
      this.datas.del(name);
    },
    updateUser:function(name,data){
      this.datas.set(name,data);
    },
    getUser:function(name){
      if(this.userExists(name)){
        return this.datas.get(name);
      }else{
        return null;
      }
    },
    getPeer:function(name){
      if(this.userExists(name)){
        return this.datas.get(name).p;
      }else{
        return null;
      }
    },
    sendMsg:function(name,text){
      if(this.getPeer(name)){
        this.newMsg(name,text);
        this.getPeer(name).send(text);
      }
    },
    newMsg:function(name,text){
      console.log(text);
      if(this.getUser(name)){
        var m=this.getUser(name).messages.concat([text]);
        console.log(m);
        this.updateUser(name,{messages:m});

      }
    }

};

module.exports = ctl;
