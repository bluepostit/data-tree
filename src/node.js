class Node {
  constructor(data, parent = null) {
    this._parent = parent
    this._data = data
    this.children = []

    Object.getOwnPropertyNames(data).forEach(key => {
      if (key === 'parent' || key === '_parent') {
        return
      } else if (key === 'children') {
        data[key].forEach(({ data }) => {
          const childNode = new Node(data, this)
          this.children.push(childNode)
        })
        return
      }

      Object.defineProperty(this, key, {
        get: () => {
          return data[key]
        }
      })
    })
    console.log(this.children)
  }

  get parent() {
    return this._parent
  }

  get data() {
    return this._data
  }
}

export default Node
