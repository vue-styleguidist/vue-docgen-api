class Documentation {
  constructor(initDocuemntation) {
    this._props = new Map(initDocuemntation.props)
    this._data = new Map(initDocuemntation.data)
  }

  set(key, value) {
    this._data.set(key, value)
  }

  get(key) {
    return this._data.get(key)
  }

  getPropDescriptor(propName) {
    var propDescriptor = this._props.get(propName)
    if (!propDescriptor) {
      this._props.set(propName, (propDescriptor = {}))
    }
    return propDescriptor
  }

  toObject() {
    var obj = {}

    for (var [key, value] of this._data) {
      obj[key] = value
    }

    if (this._props.size > 0) {
      obj.props = {}
      for (var [name, descriptor] of this._props) {
        obj.props[name] = descriptor
      }
    }

    return obj
  }
}

module.exports = Documentation
