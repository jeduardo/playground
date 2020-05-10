#!/usr/bin/env python3

import os
import socket
import sys
import threading

TIMEOUT = 0.5
BUFSIZE = 1024
SOCK_PATH = "/tmp/test.sock"


def handleConnection(sock):
    while True:
        try:
            data = sock.recv(BUFSIZE)
            if len(data) == 0:
                break
            msg = data.decode("utf-8").strip()
            print(msg)
        except socket.timeout as t:
            continue
        except OSError as e:
            break
    print("Connection to server is closed")


if __name__ == "__main__":
    print("Connecting to server at {}".format(SOCK_PATH))
    sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    sock.settimeout(TIMEOUT)
    sock.connect(SOCK_PATH)
    reader = threading.Thread(target=handleConnection, args=(sock,))
    reader.start()
    while True:
        try:
            line = input("> ")
            if len(line) == 0:
                break
            msg = line.strip()
            sock.send("{}\r\n".format(msg).encode("utf-8"))
        except (EOFError, BrokenPipeError) as e:
            break
    sock.close()
    reader.join()
