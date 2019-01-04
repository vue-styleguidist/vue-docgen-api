class Documentation {
  constructor(initDocumentation = {}) {
    this._props = new Map(adaptToKeyValue(initDocumentation.props))
    this._data = new Map(adaptToKeyValue(initDocumentation.data))
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
      this._props.set(
        propName,
        (propDescriptor = {
          comment: '',
          description: '',
          required: '',
          tags: {},
        })
      )
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
    } else {
      obj.props = undefined
    }

    return obj
  }
}

/**
 * Transforms an object into an array of tuples [key, value]
 * @param {Object} obj
 * @returns {Array<[key, value]>} the reansfromed array and [] if obj is null
 */
function adaptToKeyValue(obj) {
  return obj ? Object.keys(obj).map(k => [k, obj[k]]) : []
}

module.exports = Documentation
