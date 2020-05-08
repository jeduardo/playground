"use strict";

var fs = require("fs");
var net = require("net");

var sock = "/tmp/test.sock";

console.log("Starting server at " + sock);
fs.unlink(sock, function (stats, err) { });
var server = net.createServer(function (client) {
    client.on("connect", function () {
        console.debug("Client connected: " + client);
    });

    client.on("data", function (data) {
        var msg = data.toString('utf8').trim();
        console.log(msg);
        client.write(data);
    });

    client.on("end", function () {
        console.debug("Client disconnected: " + client);
    });
});
server.listen(sock);
