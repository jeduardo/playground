all: link

build:
	as --32 -o hello.o hello.S

link: build
	ld -m elf_i386 -s -o hello hello.o

clean:
	rm hello hello.o
