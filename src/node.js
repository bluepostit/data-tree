const IGNORED_KEYS = ['_parent', '_index', '_id']

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
    if (nodeProperty === null || nodeProperty === undefined) {
      return null
    }
    return `${absolute}${nodeProperty}`
  }

  findChildNode(key, values) {
    if (!Array.isArray(values)) {
      values = [values]
    }
    if (values.length > 1) {
      const firstValues = values.slice(0, values.length - 1)
      const lastValue = values[values.length - 1]
      const node = this.findChildNode(key, firstValues)
      return node.findChildNode(key, lastValue)
    } else if (values.length === 1) {
      const found = this.children.find((node) => {
        return node[key] === values[0]
      })
      return found || null
    }
  }

  toJSON() {
    const data = {}
    Object.getOwnPropertyNames(this).forEach(key => {
      if (IGNORED_KEYS.includes(key)) {
        return
      }
      data[key] = this[key]
    })
    delete data._data

    if (this.path) {
      data.absolutePath = this._absolute('path')
    }
    if (this._parent) {
      data.parent = {
        _id: this._parent._id,
        name: this._parent.name || null
      }
    } else {
      delete data.parent
    }
    if (this.children.length > 0) {
      data.children = this.children
    } else {
      delete data.children
    }
    return data
  }
}

export default Node
