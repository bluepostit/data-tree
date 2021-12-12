class Node {
  constructor(data, parent) {
    this._parent = parent
    this._data = data

    Object.getOwnPropertyNames(data).forEach(key => {
      if (key === 'parent' || key === '_parent') {
        return
      }

      Object.defineProperty(this, key, {
        get: () => { return data[key] }
      })
    })
  }

  get parent() {
    return this._parent
  }

  get data() {
    return this._data
  }
}

export default Node
