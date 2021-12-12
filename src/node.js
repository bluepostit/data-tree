class Node {
  constructor(data, parent) {
    this._parent = parent
    this._data = data
  }

  get parent() {
    return this._parent
  }

  get data() {
    return this._data
  }
}

export default Node
