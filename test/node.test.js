import Node from '../src/node'

describe('Node', () => {
  describe('#constructor', () => {
    it('should create a Node with the given parent', () => {
      const data = {}
      const parent = {
        title: 'test title'
      }
      const node = new Node(data, parent)
      expect(node.parent).toBe(parent)
    })

    it('should create a Node with a getter for each data key', () => {
      const data = {
        children: [],
        path: 'test-path'
      }
      const parent = {
        title: 'test title'
      }
      const node = new Node(data, parent)
      expect(node.children).toBe(data.children)
      expect(node.path).toBe(data.path)
    })

    it('should not create a getter for parent from data', () => {
      const data = {
        parent: 'test-parent',
        _parent: 'test-parent'
      }
      const parent = {
        title: 'test title'
      }
      const node = new Node(data, parent)
      expect(node.parent).toBe(parent)
    })
  })
})
