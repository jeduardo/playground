#include <arpa/inet.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#define DEFAULT_MULTICAST_GROUP "239.0.0.1"
#define PORT 12345
#define BUFFER_SIZE 1024

int main(int argc, char *argv[]) {
  const char *multicast_group = argc > 1 ? argv[1] : DEFAULT_MULTICAST_GROUP;

  int sock;
  struct sockaddr_in multicast_addr;
  struct ip_mreq multicast_request;
  char buffer[BUFFER_SIZE];

  // Create a socket for receiving datagrams
  if ((sock = socket(AF_INET, SOCK_DGRAM, 0)) < 0) {
    perror("Socket creation failed");
    exit(EXIT_FAILURE);
  }

  // Allow multiple sockets to use the same paddress and port
  int reuse = 1;
  if (setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, (char *)&reuse,
                 sizeof(reuse)) < 0) {
    perror("Setting SO_REUSEADDR failed");
    close(sock);
    exit(EXIT_FAILURE);
  }
  if (setsockopt(sock, SOL_SOCKET, SO_REUSEPORT, (char *)&reuse,
                 sizeof(reuse)) < 0) {
    perror("Setting SO_REUSEPORT failed");
    close(sock);
    exit(EXIT_FAILURE);
  }

  // Set up the address structure for the multicast group
  memset(&multicast_addr, 0, sizeof(multicast_addr));
  multicast_addr.sin_family = AF_INET;
  multicast_addr.sin_port = htons(PORT);
  multicast_addr.sin_addr.s_addr = htonl(INADDR_ANY);

  // Bind to the multicast port
  if (bind(sock, (struct sockaddr *)&multicast_addr, sizeof(multicast_addr)) <
      0) {
    perror("Binding socket failed");
    close(sock);
    exit(EXIT_FAILURE);
  }

  // Specify the multicast group to join
  multicast_request.imr_multiaddr.s_addr = inet_addr(multicast_group);
  multicast_request.imr_interface.s_addr = htonl(INADDR_ANY);
  if (setsockopt(sock, IPPROTO_IP, IP_ADD_MEMBERSHIP,
                 (char *)&multicast_request, sizeof(multicast_request)) < 0) {
    perror("Adding multicast group failed");
    close(sock);
    exit(EXIT_FAILURE);
  }

  // Receive messages from the multicast group
  while (1) {
    int nbytes = recvfrom(sock, buffer, BUFFER_SIZE, 0, NULL, 0);
    if (nbytes < 0) {
      perror("recvfrom failed");
      close(sock);
      exit(EXIT_FAILURE);
    }
    buffer[nbytes] = '\0'; // Null-terminate the received message
    printf("Received message from %s: %s\n", multicast_group, buffer);
  }

  close(sock);
  return 0;
}
