#!/usr/bin/env python3

import socket
import threading

TIMEOUT = 0.5
BUFSIZE = 1024
SOCK_PATH = "/tmp/test.sock"


def handle_connection(cli):
    while True:
        try:
            data = cli.recv(BUFSIZE)
            if not data:
                break
            message = data.decode("utf-8").strip()
            print(message)
        except socket.timeout:
            continue
        except OSError:
            break
    print("Connection to server is closed")


if __name__ == "__main__":
    print("Connecting to server at {}".format(SOCK_PATH))
    SOCK = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    SOCK.settimeout(TIMEOUT)
    SOCK.connect(SOCK_PATH)
    READER = threading.Thread(target=handle_connection, args=(SOCK,))
    READER.start()
    while True:
        try:
            line = input("> ")
            if not line:
                break
            msg = line.strip()
            SOCK.send("{}\r\n".format(msg).encode("utf-8"))
        except (EOFError, BrokenPipeError):
            break
    SOCK.close()
    READER.join()
