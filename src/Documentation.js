/*
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 *
 *  @flow
 *
 */

class Documentation {
  constructor() {
    this._props = new Map()
    this._composes = new Set()
    this._data = new Map()
  }

  addComposes(moduleName) {
    this._composes.add(moduleName)
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

    if (this._composes.size > 0) {
      obj.composes = Array.from(this._composes)
    }
    return obj
  }
}

module.exports = Documentation
