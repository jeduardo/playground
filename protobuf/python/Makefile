all: generate-stubs

generate-stubs: ../proto/payload.proto
	python3 -m grpc_tools.protoc -I../proto --python_out=. --grpc_python_out=. ../proto/payload.proto