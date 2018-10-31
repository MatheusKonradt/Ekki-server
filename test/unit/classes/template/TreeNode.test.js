const { expect } = require('chai');
const TreeNode = require('../../../../classes/template/TreeNode');

describe('unit - TreeNode', () => {
  describe('constructor', () => {
    it('should set value and children properties', () => {
      const root = new TreeNode('test');
      expect(root).to.have.property('value', 'test');
      expect(root).to.have.property('children');
    });
  });

  describe('setChild', () => {
    it('should add a children to a node', () => {
      const root = new TreeNode('root');
      const childA = new TreeNode('childA');
      const childB = new TreeNode('childB');
      root.setChild('a', childA);
      root.setChild('b', childB);
      expect(root.getChild('a')).to.be.deep.equal(childA);
      expect(root.getChild('b')).to.be.deep.equal(childB);
    });

    it('should set a deep child to a node', () => {
      const root = new TreeNode('root');
      const child = new TreeNode('childA');
      root.setChild(['a', 'b', 'c'], child);
      expect(root.getChild(['a', 'b', 'c'])).to.be.deep.equal(child);
      expect(root.getChild(['a', 'b', 'd'])).to.be.equal(null);
    });
  });

  describe('getChild', () => {
    it('should get a deep child', () => {
      const root = new TreeNode('root');
      const childA = new TreeNode('childA');
      const childB = new TreeNode('childB');
      root.setChild('a', childA);
      childA.setChild('b', childB);
      expect(root.getChild(['a', 'b'])).to.be.deep.equal(childB);
      expect(root.getChild(['a', 'c'])).to.be.equal(null);
    });
  });
});
