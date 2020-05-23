"use strict";

var PROTO_PATH = __dirname + "/../proto/payload.proto";
var ADDR = "127.0.0.1:40000";

var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

// Suggested options for similarity to existing grpc.load behavior
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


// sync function, not event based.
function processPayload(call, callback) {
    var payload = call.request;
    console.log(payload);
    callback(null, payload);
}

// stream function, receives events and send them back
function streamPayload(call) {
    call.on("data", function (payload) {
        console.log(payload);
        call.write(payload);
        // Terminating stream
        call.end();
    });
}

var server = new grpc.Server();
server.addService(playground.ProcessPayload.service, {
    process: processPayload,
    stream: streamPayload
});
server.bind(ADDR, grpc.ServerCredentials.createInsecure());
console.log("Listening at " + ADDR);
server.start();