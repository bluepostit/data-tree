const IGNORED_KEYS = ['_parent', '_index']

const buildData = (data, node) => {
  Object.getOwnPropertyNames(data).forEach(key => {
    if (IGNORED_KEYS.includes(key)) {
      return
    }
    if (key === 'children') {
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

const buildAbsoluteMethods = (node) => {
  Object.defineProperty(node, '_absolute', {
    value: (key, separator = '/') => {
      let absolute = ''
      if (node._parent && node._parent._absolute) {
        absolute = (node._parent._absolute(key, separator) || '') + separator
      }
      const nodeProperty = node[key]
      if (nodeProperty === null) {
        return null
      }
      return `${absolute}${nodeProperty}`
    }
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
    buildAbsoluteMethods(this)
  }

  get parentNode() {
    return this._parent
  }

  get _id() {
    let id = this._generation.toString()
    if (this._index !== null) {
      id = `${id}.${this._index}`
    }
    return id
  }
}

export default Node
