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

    it('should create a Node with the given data', () => {
      const data = {
        children: []
      }
      const parent = {
        title: 'test title'
      }
      const node = new Node(data, parent)
      expect(node.data).toBe(data)
    })
  })
})
