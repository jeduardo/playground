#!/usr/bin/env python3

import random


class Node:
    def __init__(self, value: int) -> None:
        self.value = value
        self.left: Node | None = None
        self.right: Node | None = None

    def __repr__(self) -> str:
        return f"Node({self.value}, left: {self.left}, right:{self.right})"

    def append(self, node):
        if node.value < self.value:
            if self.left:
                self.left.append(node)
            else:
                self.left = node
        elif node.value > self.value:
            if self.right:
                self.right.append(node)
            else:
                self.right = node


class NodeInOrderIterator:
    def __init__(self, root: Node) -> None:
        self.stack = []
        self._push_left(root)

    def _push_left(self, node: Node | None) -> None:
        while node:
            self.stack.append(node)
            node = node.left

    def __iter__(self):
        return self

    def __next__(self):
        if not self.stack:
            raise StopIteration
        node = self.stack.pop()
        value = node.value
        self._push_left(node.right)
        return value


def main():
    numbers = [random.randint(1, 100) for _ in range(10)]

    root = Node(numbers.pop(0))
    for num in numbers:
        root.append(Node(num))

    for node in NodeInOrderIterator(root):
        print(f"{node}", end=",")


if __name__ == "__main__":
    main()
