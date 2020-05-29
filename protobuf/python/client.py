#!/usr/bin/env python3

import grpc
import logging
import payload_pb2
import payload_pb2_grpc


def run():
    payload = payload_pb2.Payload(
        name="test payload", data="test payload".encode())
    with grpc.insecure_channel('localhost:40000') as channel:
        stub = payload_pb2_grpc.ProcessPayloadStub(channel)
        print(stub.process(payload))


if __name__ == '__main__':
    logging.basicConfig()
    run()
