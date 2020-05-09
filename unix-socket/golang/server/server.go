package main

import (
	"bufio"
	"fmt"
	"net"
	"os"
	"strings"
)

const sock = "/tmp/test.sock"

func handleClient(c net.Conn) {
	fmt.Printf("Client connected: %s\n", c)
	reader := bufio.NewReader(c)
	writer := bufio.NewWriter(c)
	for {
		data, err := reader.ReadString('\n')
		if err != nil {
			fmt.Println(err)
			break
		}
		msg := strings.TrimSpace(data)
		fmt.Println(msg)
		_, err = writer.Write([]byte(msg))
		if err != nil {
			fmt.Println(err)
			break
		}
	}
	fmt.Printf("Client disconnected: %s\n", c)
}

func main() {
	os.Remove(sock)

	fmt.Printf("Starting server at %s\n", sock)

	conn, _ := net.Listen("unix", sock)
	for {
		client, _ := conn.Accept()
		go handleClient(client)
		defer client.Close()
	}
}
