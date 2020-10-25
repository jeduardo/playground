.data /* initialized data segment */

msg:
  .ascii "Hello assembly\n" /* message */
  len = . - msg /* message length */

.text /* code segment */
  .globl _start

_start:
  mov x0, #1 /* file handle - 1 -> stdout */
  ldr x1, =msg /* pointer to message */
  ldr x2, =len /* message length */
  mov w8, #64 /* syscall number for sys_write */
  svc #0 /* call kernel */

  mov x0, #0 /* exit code */
  mov w8, #93 /* syscall for sys_exit */
  svc #0 /* call kernel */

