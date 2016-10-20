var Mdb=require('./mdb.js');

var ctl = {
    datas: new Mdb(),
    userName:'',
    sid:'',

    select:function(i){
      this.app.select(i);
    },
    userExists:function(sid){
      return this.datas.exists(sid);
    },
    newUser:function(sid,name,content){
      this.datas.add(sid,{name:name,sid:sid,content:content})
    },
    delUser:function(sid){
      this.datas.del(sid);
    },
    updateUser:function(sid,data){
      this.datas.set(sid,data);
    },
    getPeer:function(sid){
      if(this.userExists(sid)){
        return this.datas.get(sid).p;
      }else{
        return null;
      }
    }

};

module.exports = ctl;
