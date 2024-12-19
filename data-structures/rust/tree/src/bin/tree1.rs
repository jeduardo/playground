use std::cell::RefCell;
use std::rc::Rc;

#[derive(Debug, Clone)]
pub struct TreeNode {
    val: i32,
    left: Option<TreeNodeRef>,
    right: Option<TreeNodeRef>,
}

type TreeNodeRef = Rc<RefCell<TreeNode>>;

pub fn traverse_loop(root: TreeNodeRef) {
    let mut stack = vec![root];
    while !stack.is_empty() {
        let current: Rc<RefCell<TreeNode>> = stack.pop().unwrap();
        print!("{},", current.borrow().val);
        if let Some(right) = &current.borrow().right {
            stack.push(right.to_owned());
        };
        if let Some(left) = &current.borrow().left {
            stack.push(left.to_owned());
        };
    }
}

fn main() {
    let mut root = TreeNode {
        val: 60,
        left: None,
        right: None,
    };
    let mut left_a = TreeNode {
        val: 29,
        left: None,
        right: None,
    };
    let mut right_a = TreeNode {
        val: 62,
        left: None,
        right: None,
    };
    let left_a_left = TreeNode {
        val: 14,
        left: None,
        right: None,
    };
    let left_a_right = TreeNode {
        val: 30,
        left: None,
        right: None,
    };
    let right_a_left = TreeNode {
        val: 59,
        left: None,
        right: None,
    };
    let right_a_right = TreeNode {
        val: 65,
        left: None,
        right: None,
    };

    // Need to build the tree from the leaves first to avoid
    // tripping into move semantics
    left_a.left = Some(Rc::new(RefCell::new(left_a_left)));
    left_a.right = Some(Rc::new(RefCell::new(left_a_right)));

    right_a.left = Some(Rc::new(RefCell::new(right_a_left)));
    right_a.right = Some(Rc::new(RefCell::new(right_a_right)));

    root.left = Some(Rc::new(RefCell::new(left_a)));
    root.right = Some(Rc::new(RefCell::new(right_a)));

    // Need to pass new reference to function
    traverse_loop(Rc::new(RefCell::new(root)));
}
