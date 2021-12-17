import Node from '../src/node'

describe('Node', () => {
  describe('#constructor', () => {
    it('should create a Node with the given parent', () => {
      const data = {}
      const parent = {
        title: 'test title',
        children: []
      }
      const node = new Node(data, parent)
      expect(node.parentNode).toBe(parent)
    })

    it('should create a Node with a getter for each data key', () => {
      const data = {
        unicorns: [],
        path: 'test-path'
      }
      const parent = {
        title: 'test title',
        children: []
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
        title: 'test title',
        children: []
      }
      const node = new Node(data, parent)
      expect(node.parentNode).toBe(parent)
    })

    it('should create a node with empty parent when given no parent', () => {
      const data = {
        unicorns: [],
        path: 'test-path'
      }

      const node = new Node(data)
      expect(node.parentNode).toBeNull()
    })

    it('should create Node elements of given children in data', () => {
      const data = {
        children: [
          {
            name: 'child 1'
          },
          {
            name: 'child 2'
          }
        ]
      }
      const node = new Node(data)
      const children = node.children
      expect(children[0]).toBeInstanceOf(Node)
      expect(children[0].name).toBe(children[0].name)
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
      expect(children[0].parentNode).toBe(node)
    })
  })

  describe('._generation', () => {
    it('should return the generation number for the node', () => {
      const data = require('./fixtures/3-generations.json')
      const root = new Node(data)
      expect(root._generation).toBe(0)
      expect(root.children[0]._generation).toBe(1)
      expect(root.children[0].children[1]._generation).toBe(2)
    })
  })

  describe('._index', () => {
    it("should return the node's index on its parent node", () => {
      const data = require('./fixtures/3-generations.json')
      const root = new Node(data)
      expect(root._index).toBeNull()
      expect(root.children[0]._index).toBe(0)
      expect(root.children[0].children[1]._index).toBe(1)
    })

    it("should ignore data with key '_index'", () => {
      const node = new Node({ _index: 9, index: 9 })
      expect(node._index).toBeNull()
    })
  })

  describe('._id', () => {
    it('should return an id consisting of its generation and index', () => {
      const data = require('./fixtures/3-generations.json')
      const root = new Node(data)
      expect(root._id).toBe('0')
      expect(root.children[0]._id).toBe('1.0')
      expect(root.children[0].children[1]._id).toBe('2.1')
    })
  })

  describe('#_absolute', () => {
    it("returns the root's value for the property", () => {
      const node = new Node({ name: 'root' })
      expect(node._absolute('_id')).toBe(node._id)
      expect(node._absolute('name')).toBe(node.name)
    })
    it('returns the absolute id starting at the root', () => {
      const data = require('./fixtures/3-generations.json')
      const root = new Node(data)
      let absoluteIndex = root.children[0]._absolute('_index')
      expect(absoluteIndex).toBe('/0')
      expect(root.children[0].children[1]._absolute('_index')).toBe('/0/1')
      expect(root.children[0].children[1]._absolute('_id')).toBe('0/1.0/2.1')
      expect(root.children[0].children[1]._absolute('name')).toBe('root/gen1-node0/gen2-node1')
    })
  })

  describe('#findChildNode', () => {
    it('should return null if not found', () => {
      let node = new Node({})
      let child = node.findChildNode('id', '4')
      expect(child).toBeNull()

      const data = require('./fixtures/3-generations.json')
      node = new Node(data)
      child = node.findChildNode('name', 'unicorn')
      expect(child).toBeNull()
    })

    it('should return the child node matching the given key and value', () => {
      const data = require('./fixtures/3-generations.json')
      const node = new Node(data)
      const childName = 'gen1-node0'
      const child = node.findChildNode('name', childName)
      expect(child).toBeInstanceOf(Node)
      expect(child.name).toBe(childName)
    })

    it('should recurse if required', () => {
      const data = require('./fixtures/3-generations.json')
      const node = new Node(data)
      const childNames = ['gen1-node0', 'gen2-node0']
      const child = node.findChildNode('name', childNames)
      expect(child).toBeInstanceOf(Node)
      expect(child.name).toBe('gen2-node0')
    })

    it('should return null when not found in recursing', () => {
      const data = require('./fixtures/3-generations.json')
      const node = new Node(data)
      const childNames = ['gen1-node0', 'gen2-node999']
      const child = node.findChildNode('name', childNames)
      expect(child).toBeNull()
    })
  })

  describe('.extension', () => {
    it('should not return an extension if the path has none', () => {
      const data = [{ path: 'test' }, { path: 'test.' }, { path: 'test. pdf' }, { name: 'hello.txt' }]

      data.forEach(item => {
        const node = new Node(item)
        expect(node.extension).toBeNull()
      })
    })

    it('should return the correct path extension', () => {
      const data = [
        {
          path: 'test.a',
          extension: 'a'
        },
        {
          path: 'a real interesting test.txt',
          extension: 'txt'
        },
        {
          path: 'test.asdf ',
          extension: 'asdf'
        },
        {
          path: '789.7',
          extension: '7'
        }
      ]

      data.forEach(item => {
        const node = new Node({ path: item.path })
        expect(node.extension).toBe(item.extension)
      })
    })
  })
})
