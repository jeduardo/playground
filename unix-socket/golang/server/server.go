package main

import (
	"bufio"
	"fmt"
	"net"
	"os"
	"strings"
)

const sock = "/tmp/test.sock"

func handleClient(conn net.Conn) {
	fmt.Printf("Client connected: %s\n", conn)
	reader := bufio.NewReader(conn)
	var payload strings.Builder
	for {
		data, err := reader.ReadString('\n')
		if err != nil {
			fmt.Println(err)
			break
		}
		msg := strings.TrimSpace(data)
		fmt.Println(msg)
		payload.WriteString(msg)
		payload.WriteString("\r\n")
		_, err = conn.Write([]byte(payload.String()))
		if err != nil {
			fmt.Println(err)
			break
		}
		payload.Reset()
	}
	fmt.Printf("Client disconnected: %s\n", conn)
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
