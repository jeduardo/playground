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
	reader := bufio.NewReader(c)
	for {
		data, err := reader.ReadString('\n')
		if err != nil {
			os.Exit(1)
		}
		msg := strings.TrimSpace(data)
		fmt.Println(msg)
	}
}

func main() {
	fmt.Printf("Connecting to server at %s\n", sock)

	conn, _ := net.Dial("unix", sock)
	writer := bufio.NewWriter(conn)
	go handleClient(conn)
	defer conn.Close()

	reader := bufio.NewReader(os.Stdin)
	for {
		fmt.Print("> ")
		text, err := reader.ReadString('\n')
		if err != nil {
			fmt.Println(err)
			os.Exit(0)
		}
		msg := strings.TrimSpace(text)
		writer.Write([]byte(msg))
		writer.Write([]byte("\r\n"))
		writer.Flush()
	}
}
