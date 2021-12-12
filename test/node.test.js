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
        unicorns: [],
        path: 'test-path'
      }
      const parent = {
        title: 'test title'
      }
      const node = new Node(data, parent)
      expect(node.unicorns).toBe(data.unicorns)
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

    it('should create a node with empty parent when given no parent', () => {
      const data = {
        unicorns: [],
        path: 'test-path'
      }

      const node = new Node(data)
      expect(node.parent).toBeNull()
    })

    it('should create Node elements of given children in data', () => {
      const data = {
        children: [
          {
            data: {
              name: 'child 1'
            }
          },
          {
            data: {
              name: 'child 2'
            }
          }
        ]
      }
      const node = new Node(data)
      const children = node.children
      expect(children[0]).toBeInstanceOf(Node)
      expect(children[0].name).toBe(children[0].data.name)
    })

    it('should ignore parent data of given children', () => {
      const data = {
        children: [
          {
            data: {
              name: 'child 1',
              parent: 'fake parent'
            }
          }
        ]
      }
      const node = new Node(data)
      const children = node.children
      expect(children[0]).toBeInstanceOf(Node)
      expect(children[0].parent).toBe(node)
    })
  })
})
