package main

import (
	"bufio"
	"fmt"
	"log"
	"net"
	"strings"
)

func handleClient(conn net.Conn) {
	var addr string

	if tcpaddr, ok := conn.RemoteAddr().(*net.TCPAddr); ok {
		addr = tcpaddr.IP.String()
	}
	fmt.Printf("Client connected: %s\n", addr)

	r := bufio.NewReader(conn)
	w := bufio.NewWriter(conn)
	for {

		content, err := r.ReadString('\n')
		if err != nil {
			log.Println(err)
			break
		}
		content = strings.Trim(content, "\n")

		size, err := fmt.Fprintf(w, "%s\r\n", content)
		if err != nil {
			log.Println(err)
			break
		}

		err = w.Flush()
		if err != nil {
			log.Println(err)
			break
		}
		fmt.Printf("Wrote %d bytes back to %s\n", size, addr)

	}

	fmt.Printf("Client %s disconnected\n", addr)
}

func main() {
	port := 4000
	ln, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Server open at port %d\n", port)

	for {
		conn, err := ln.Accept()
		if err != nil {
			log.Fatal(err)
		}
		go handleClient(conn)
	}
}
