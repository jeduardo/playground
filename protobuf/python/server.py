#!/usr/bin/env python3

import grpc
import logging
import time
import payload_pb2
import payload_pb2_grpc

from concurrent import futures


class PayloadProcessServicer(payload_pb2_grpc.ProcessPayloadServicer):

    def process(self, payload, context):
        print(payload)
        return payload


def run():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    payload_pb2_grpc.add_ProcessPayloadServicer_to_server(
        PayloadProcessServicer(), server)
    server.add_insecure_port('localhost:40000')
    server.start()
    # prevent the main thread from exiting
    try:
        while True:
            time.sleep(60 * 60 * 24)
    except KeyboardInterrupt:
        server.stop(0)


if __name__ == '__main__':
    logging.basicConfig()
    run()
