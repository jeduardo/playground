"use strict";

var PROTO_PATH = __dirname + "/../proto/payload.proto";
var ADDR = "127.0.0.1:40000";

var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// The protoDescriptor object has the full package hierarchy
var playground = protoDescriptor.playground;

var client = new playground.ProcessPayload(ADDR, grpc.credentials.createInsecure());


console.log("Calling server at " + ADDR);

console.log("Calling with sync implementation");
var msg = {
    "name": "test message",
    "data": Buffer.from("test message", "utf8")
}
// Object itself is returned here
client.process(msg, function (err, payload) {
    if (err) {
        throw err;
    } else {
        console.log(payload);
    }
});

console.log("Calling with streaming implementation");
var msg = {
    "name": "test message streaming",
    "data": Buffer.from("test message streaming", "utf8")
}
var call = client.stream(msg);
call.on("data", function(payload) {
    console.log(payload);
});
call.write(msg);
call.end();