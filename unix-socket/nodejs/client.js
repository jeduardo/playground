"use strict";

var net = require("net");
var readline = require("readline");

var sock = "/tmp/test.sock";

console.log("Connecting to server at " + sock);
var client = net.connect(sock);
client.on("data", function (data) {
    console.log(data.toString("utf8").trim());
});

var prompt = readline.createInterface(process.stdin, process.stdout);
prompt.setPrompt("> ");
prompt.prompt();
prompt.on("line", function (line) {
    client.write(line + "\r\n");
    prompt.prompt();
});
prompt.on("close", function () {
    process.exit(0);
});