AS=/usr/arm-linux-gnueabihf/bin/as
LD=/usr/arm-linux-gnueabihf/bin/ld

all: link

build:
	$(AS) -o hello.o hello.S

link: build
	$(LD) -o hello hello.o

clean:
	rm hello hello.o
