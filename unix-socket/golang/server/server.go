package main

import (
	"bytes"
	"fmt"
	"io"
	"net"
	"os"
	"strings"
)

const sock = "/tmp/test.sock"

func handleClient(c net.Conn) {
	var buf bytes.Buffer
	io.Copy(&buf, c)
	msg := strings.TrimSpace(buf.String())
	fmt.Println(msg)
	c.Write(buf.Bytes())
}

func main() {
	os.Remove(sock)

	fmt.Printf("Starting server at %s\n", sock)

	conn, _ := net.Listen("unix", sock)
	for {
		client, _ := conn.Accept()
		fmt.Printf("Client connected: %s\n", client)
		go handleClient(client)
		defer client.Close()
	}
}
