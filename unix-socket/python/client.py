#!/usr/bin/env python3

import multiprocessing
import socket
import sys

SOCK_PATH = "/tmp/test.sock"
BUFFER_SIZE = 1024


def handleConnection(conn):
    while True:
        data = conn.recv(BUFFER_SIZE)
        if len(data) == 0:
            sys.exit(1)
        msg = data.decode("utf-8").strip()
        print(msg)


print("Connecting to server at {}".format(SOCK_PATH))
client = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
client.connect(SOCK_PATH)
reader = multiprocessing.Process(target=handleConnection, args=(client,))
reader.start()

while True:
    try:
        data = input("> ")
        msg = data.strip()
        client.send("{}\r\n".format(msg).encode("utf-8"))
    except (EOFError, KeyboardInterrupt, BrokenPipeError) as e:
        print(e)
        reader.terminate()
        sys.exit(1)
