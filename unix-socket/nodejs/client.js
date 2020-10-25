"use strict";

const net = require("net");
const readline = require("readline");

let sock = "/tmp/test.sock";

console.log("Connecting to server at " + sock);
let client = net.connect(sock);
client.on("data", data => {
    console.log(data.toString("utf8").trim());
});

let prompt = readline.createInterface(process.stdin, process.stdout);
prompt.setPrompt("> ");
prompt.prompt();
prompt.on("line", line => {
    client.write(line + "\r\n");
    prompt.prompt();
});
prompt.on("close", () => {
    process.exit(0);
});

