all: link

build:
	as -o hello.o hello.S

link: build
	ld -o hello hello.o

clean:
	rm hello hello.o
