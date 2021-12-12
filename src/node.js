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

  _absolute(key, separator = '/') {
    let absolute = ''
    if (this._parent && this._parent._absolute) {
      absolute = (this._parent._absolute(key, separator) || '') + separator
    }
    const nodeProperty = this[key]
    if (nodeProperty === null) {
      return null
    }
    return `${absolute}${nodeProperty}`
  }

  findChildNode(key, values) {
    if (!Array.isArray(values)) {
      values = [values]
    }
    if (values.length > 1) {
      const shorterValues = values.slice(0, values.length - 1)
      const node = this.findChildNode(key, shorterValues)
      return node.findChildNode(key, values.slice(1))
    } else if (values.length === 1) {
      const found = this.children.find((node) => {
        return node[key] === values[0]
      })
      return found || null
    }
  }
}

export default Node
