import { utils } from 'react-docgen'
import recast from 'recast'
import getPropDefault from './getPropDefault'

const { getPropertyName, printValue, resolveToValue } = utils
const {
  types: { namedTypes: types },
} = recast

function isObjectExpress(path) {
  return types.ObjectExpression.check(path.node)
}

export function getType(path) {
  const node = path.node
  const name = node.name.toLowerCase()
  if (name === 'function') return 'func'
  return name
}

function getArrayType(path) {
  const types = []
  path.get('elements').each(function(elementPath) {
    types.push(getType(elementPath.get('value')))
  })
  return types.join('|')
}

export default function getPropType(path) {
  const propType = {}
  let typeName = 'undefined'
  let propDefault
  let required = false
  if (isObjectExpress(path)) {
    path.get('properties').each(function(propertyPath) {
      if (propertyPath.node.type === types.Property.name) {
        const propertyName = getPropertyName(propertyPath)
        if (propertyName === 'type') {
          var valuePath = propertyPath.get('value')
          var node = valuePath.node
          if (types.Identifier.check(node)) {
            typeName = getType(valuePath)
          } else if (types.ArrayExpression.check(node)) {
            typeName = getArrayType(valuePath)
          }
        } else if (propertyName === 'required') {
          required = true
        } else if (propertyName === 'default') {
          const valuePath = propertyPath.get('value')
          propDefault = getPropDefault(valuePath)
        }
      }
    })
  } else {
    typeName = getType(path)
  }

  propType.type = {
    name: typeName,
  }
  propType.required = required
  if (propDefault) {
    propType.default = propDefault
  }
  return propType
}
