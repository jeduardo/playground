use std::cell::RefCell;
use std::fmt;
use std::rc::Rc;
use std::vec;

struct Node {
    val: i32,
    parents: Vec<Rc<RefCell<Node>>>,
    children: Vec<Rc<RefCell<Node>>>,
}

impl Node {
    fn new(val: i32) -> Self {
        Node {
            val,
            parents: vec![],
            children: vec![],
        }
    }

    fn add_child(&mut self, child: Rc<RefCell<Node>>) {
        // TODO: Add reference to parent
        self.children.push(child);
    }
}

impl fmt::Debug for Node {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "(val: {}, parents: {:?}, children: {:?})",
            self.val, self.parents, self.children
        )
    }
}

impl fmt::Display for Node {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "(val: {}, parents: {:?}, children: {:?})",
            self.val, self.parents, self.children
        )
    }
}

fn main() {
    let node1_ref = Rc::new(RefCell::new(Node::new(10)));
    let node2_ref = Rc::new(RefCell::new(Node::new(20)));
    let node3_ref = Rc::new(RefCell::new(Node::new(30)));

    node2_ref.borrow_mut().add_child(Rc::clone(&node1_ref));
    node3_ref.borrow_mut().add_child(Rc::clone(&node1_ref));
    node3_ref.borrow_mut().add_child(Rc::clone(&node2_ref));

    println!("{:?}", node1_ref);
    println!("{:?}", node2_ref);
    println!("{:?}", node3_ref);

    // Clone the inner Node and modify it
    let new_val = node1_ref.borrow().val + 5;
    node1_ref.borrow_mut().val = new_val;

    println!("{:?}", node1_ref);
    println!("{:?}", node2_ref);
    println!("{:?}", node3_ref);
}
