#!/usr/bin/env python3

import os
import socketserver

BUFSIZE = 1024
SOCK_PATH = "/tmp/test.sock"


class ServerHandler(socketserver.BaseRequestHandler):

    def handle(self):
        print("Client connected: {}".format(self.request))
        try:
            while True:
                data = self.request.recv(BUFSIZE)
                if len(data) == 0:
                    break
                msg = data.decode("utf-8").strip()
                print(msg)
                self.request.sendall("{}\r\n".format(msg).encode("utf-8"))
        except BrokenPipeError:
            pass
        print("Client disconnected: {}".format(self.request))

if __name__ == "__main__":
    try:
        os.remove(SOCK_PATH)
    except OSError:
        pass

    try:
        print("Starting server at {}".format(SOCK_PATH))
        with socketserver.UnixStreamServer(SOCK_PATH, ServerHandler) as server:
            server.serve_forever()
    except KeyboardInterrupt:
        pass