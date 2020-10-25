.data /* initialized data segment */

msg:
  .ascii "Hello assembly\n" /* message */
  len = . - msg /* message length */

.text /* code segment */
  .globl _start

_start:
  mov %r0, $1 /* file handle - 1 -> stdout */
  ldr %r1, =msg /* pointer to message */
  ldr %r2, =len /* message length */
  mov %r7, $4 /* syscall number for sys_write */
  swi $0 /* call kernel */

  mov %r0, $0 /* exit code */
  mov %r7, $1 /* syscall for sys_exit */
  swi $0 /* call kernel */


