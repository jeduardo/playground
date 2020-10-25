"use strict";

const fs = require("fs");
const net = require("net");

const sock = "/tmp/test.sock";

console.log("Starting server at " + sock);
fs.unlink(sock, (stats, err) => {});
let server = net.createServer(client => {
    console.info("Client connected: " + client);

    client.on("data", data => {
        let msg = data.toString('utf8').trim();
        console.log(msg);
        client.write(data);
    });

    client.on("end", () => {
        console.info("Client disconnected: " + client);
    });
});
server.listen(sock);
