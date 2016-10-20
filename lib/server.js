var cfEnv = require("cfenv");
var appEnv = cfEnv.getAppEnv();
var express = require('express');
var helmet = require('helmet');
var app = express();
var server = require('http').Server(app);

app.use(helmet());
console.log("dist",__dirname + '/../dist')
app.use(express.static(__dirname + '/../dist'));

server.listen(appEnv.port);
console.log("Server started", "listening on " + appEnv.bind + " port: " + appEnv.port + " ...");


module.exports=server;
