var Promise = require("bluebird");
var dbClient = require("./rc.js").getClient();

var kttl = 60 * 60 * 48;

var siddb = {};

var setSidUser = function(sid, user) {
    return new Promise(function(resolve, reject) {
        dbClient.setex('sid:' + sid, kttl, user, function(err, reply) {
            if (err) {
                reject("db error");
            };

            resolve(sid);

        });
    });
}

var getSidUser = function(sid) {
    return new Promise(function(resolve, reject) {
        dbClient.get('sid:' + sid, function(err, reply) {
            if (err) {
                reject("db error");
            };

            resolve(reply)

        });
    });
}

var deleteSid = function(sid) {
    return new Promise(function(resolve, reject) {
        dbClient.del('sid:' + sid, function(err, reply) {
            if (err) {
                reject("db error");
            };

            resolve(sid);

        });
    });
}

var setUserSid = function(user, sid) {
    return new Promise(function(resolve, reject) {
        dbClient.setex('user:' + user, kttl, sid, function(err, reply) {
            if (err) {
                reject("db error");
            };

            resolve(sid);

        });
    });
}

var getUserSid = function(user) {
    return new Promise(function(resolve, reject) {
        dbClient.get('user:' + user, function(err, reply) {
            if (err) {
                reject("db error");
            };

            resolve(reply)

        });
    });
}

var deleteUser = function(user) {
    return new Promise(function(resolve, reject) {
        dbClient.del('user:' + user, function(err, reply) {
            if (err) {
                reject("db error");
            };

            resolve(sid);

        });
    });
}

//COMBO
siddb.newUser = function(sid) {
    var rname = (Math.floor(Math.random() * 90000) + 10000).toString();
    var psetSidUser = setSidUser(sid, rname);
    var psetUserSid = psetSidUser.then(function(result) {
        return setUserSid(rname, sid)
    });
    return psetUserSid.then(function(result) {
        return Promise.resolve(rname)
    });
}
siddb.forgetSid=function(sid){
  var user;
  var pgetSidUser = getSidUser(sid);
  var pdeleteSid=pgetSidUser.then(function(result){user=result;return deleteSid(sid);});
  return pdeleteSid.then(function(result) {
      return Promise.resolve(user);
  });
}
siddb.fromTo = function(sid, user) {
    var from,
        to;
    var pgetSidUser = getSidUser(sid);
    var pgetUserSid = pgetSidUser.then(function(result) {
        from = result;
        return getUserSid(user);
    });
    return pgetUserSid.then(function(result) {
        return Promise.resolve({from: from, to: result})
    });
}

module.exports = siddb;
