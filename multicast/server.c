#include <arpa/inet.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#define DEFAULT_MULTICAST_GROUP "239.0.0.1"
#define PORT 12345
#define MESSAGE "Hello, Multicast!"

int main(int argc, char *argv[]) {
  const char *multicast_group = argc > 1 ? argv[1] : DEFAULT_MULTICAST_GROUP;

  int sock;
  struct sockaddr_in multicast_addr;

  // Create a socket for sending datagrams
  if ((sock = socket(AF_INET, SOCK_DGRAM, 0)) < 0) {
    perror("Socket creation failed");
    exit(EXIT_FAILURE);
  }

  // Set up the multicast address
  memset(&multicast_addr, 0, sizeof(multicast_addr));
  multicast_addr.sin_family = AF_INET;
  multicast_addr.sin_port = htons(PORT);
  multicast_addr.sin_addr.s_addr = inet_addr(multicast_group);

  // Send messages to the multicast group every second
  while (1) {
    if (sendto(sock, MESSAGE, strlen(MESSAGE), 0,
               (struct sockaddr *)&multicast_addr,
               sizeof(multicast_addr)) < 0) {
      perror("sendto failed");
      close(sock);
      exit(EXIT_FAILURE);
    }
    printf("Message sent to %s: %s\n", multicast_group, MESSAGE);
    sleep(1);
  }

  close(sock);
  return 0;
}
