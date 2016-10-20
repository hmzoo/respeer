var Mdb=require('./mdb.js');

var ctl = {
    datas: new Mdb(),
    userName:'',
    sid:'',

    select:function(i){
      this.app.select(i);
    },
    userExists:function(name){
      return this.datas.exists(name);
    },
    newUser:function(name){
      this.datas.add(name,{name:name,linked:false})
    },
    delUser:function(name){
      this.datas.del(name);
    },
    updateUser:function(name,data){
      this.datas.set(name,data);
    },
    getPeer:function(){
      if(this.userExists(name)){
        return this.datas.get(name).p;
      }else{
        return null;
      }
    }

};

module.exports = ctl;
