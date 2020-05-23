"use strict";

var protobuf = require("protobufjs");
var fs = require("fs");

protobuf.load("../proto/payload.proto", function (err, root) {
    if (err) {
        throw err;
    }

    var Payload = root.lookupType("Payload");

    var msg = {
        "name": "test message",
        "data": Buffer.from("test message", "utf8")
    }
    console.log(msg);

    var errMsg = Payload.verify(msg);
    if (errMsg) {
        throw err;
    }

    var otherMsg = Payload.create(msg);
    console.log(otherMsg);
    var buffer = Payload.encode(otherMsg).finish();
    console.log(buffer);

    var decoded = Payload.decode(buffer);
    console.log(decoded);

    fs.writeFile("/tmp/out.data", buffer, function(err) {
        if (err) {
            throw err;
        }
    });

    fs.readFile("/tmp/out.data", function(err, data) {
        var decoded = Payload.decode(data);
        console.log(decoded);
    })

});