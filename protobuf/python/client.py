#!/usr/bin/env python3

import grpc
import logging
import payload_pb2
import payload_pb2_grpc


def generate_messages():
    for i in range(0, 5):
        data = "test payload {}".format(i)
        payload = payload_pb2.Payload(name=data, data=data.encode())
        yield payload


def run():
    payload = payload_pb2.Payload(
        name="test payload", data="test payload".encode())
    with grpc.insecure_channel('localhost:40000') as channel:
        print("Sync call")
        stub = payload_pb2_grpc.ProcessPayloadStub(channel)
        print(stub.process(payload))
        print("Stream call")
        responses = stub.stream(generate_messages())
        for response in responses:
            print(response)


if __name__ == '__main__':
    logging.basicConfig()
    run()
