const buildData = (data, node) => {
  Object.getOwnPropertyNames(data).forEach(key => {
    if (key === 'parent' || key === '_parent') {
      return
    } else if (key === 'children') {
      data[key].forEach((data, index) => {
        const childNode = new Node(data, node, index)
        node.children.push(childNode)
      })
      return
    }

    Object.defineProperty(node, key, {
      get: () => {
        return data[key]
      }
    })
  })
}

class Node {
  constructor(data, parent = null, index = null) {
    this._parent = parent
    this._data = data
    this._index = index
    this.children = []

    if (!this._parent) {
      this._generation = 0
    } else {
      this._generation = this._parent._generation + 1
    }

    buildData(data, this)
  }

  get parent() {
    return this._parent
  }
}

export default Node
