#!/usr/bin/env python3

import os
import socket
import threading

SOCK_PATH = "/tmp/test.sock"

def handleConnection(c):
    # Read from string until there is a problem
    # When there is a problem, run os.exit(1)
    yield


print("Connecting to server at {}".format(SOCK_PATH))
client = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
client.connect(SOCK_PATH)

while True:
    try:
        data = input("> ")
        msg = data.strip()
        client.send("{}\r\n".format(msg).encode("utf-8"))
    except (EOFError, KeyboardInterrupt) as e:
        break

client.close()
