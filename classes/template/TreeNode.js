const assert = require('assert');
const _ = require('lodash');

class TreeNode {
  constructor(value) {
    this.setValue(value || null);
    this.children = {};
  }

  setValue(value) {
    this.value = value;
    return this;
  }

  getValue() {
    return this.value;
  }

  setChild(name, treeNode) {
    assert(treeNode instanceof TreeNode, 'expected second argument to be instance of TreeNode');

    if (Array.isArray(name)) {
      let node = this;
      for (const n of name) {
        if (!node.hasChild(n)) {
          node.setChild(n, new TreeNode());
        }
        if (n === _.last(name)) {
          node.setChild(n, treeNode);
        } else {
          node = node.getChild(n);
        }
      }
    } else {
      this.children[name] = treeNode;
    }
    return this;
  }

  getChild(name) {
    if (Array.isArray(name)) {
      let node = this;
      for (const n of name) {
        node = node.getChild(n);
        if (!node) return null;
      }
      return node;
    }
    return this.children[name] || null;
  }

  hasChild(name) {
    return this.getChild(name) !== null;
  }
}

module.exports = TreeNode;
