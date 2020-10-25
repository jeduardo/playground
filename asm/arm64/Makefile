AS=/usr/aarch64-linux-gnu/bin/as
LD=/usr/aarch64-linux-gnu/bin/ld

all: link

build:
	$(AS) -o hello.o hello.S

link: build
	$(LD) -o hello hello.o

clean:
	rm hello hello.o
