.data # initialized data segment

msg:
  .ascii "Hello assembly\n" # message
  len = . - msg # message length

.text # code segment
  .globl _start

_start:
  mov $len,%edx # message length
  mov $msg,%ecx # pointer to message
  mov $1,%ebx # file handle - 1 -> stdout
  mov $4,%eax # syscall number for sys_write
  int $0x80 # call kernel

  mov $0,%ebx # exit code
  mov $1,%eax # syscall for sys_exit
  int $0x80


