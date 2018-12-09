import { utils } from 'react-docgen'
import recast from 'recast'
import getPropType, { getType } from '../utils/getPropType'

const {
  getMemberValuePath,
  resolveToValue,
  printValue,
  isRequiredPropType,
  getPropertyName,
} = utils
const {
  types: { namedTypes: types },
} = recast

function isObjectExpress(path) {
  return types.ObjectExpression.check(path.node)
}

function amendPropTypes(documentation, path) {
  if (!types.ObjectExpression.check(path.node)) {
    return
  }

  path.get('properties').each(function(propertyPath) {
    switch (propertyPath.node.type) {
      case types.Property.name:
        const propDescriptor = documentation.getPropDescriptor(
          getPropertyName(propertyPath)
        )
        const valuePath = propertyPath.get('value')
        const { type } = getPropType(valuePath)

        if (type) {
          propDescriptor.type = type
        }
        break
      case types.SpreadProperty.name:
        var resolvedValuePath = resolveToValue(propertyPath.get('argument'))
        switch (resolvedValuePath.node.type) {
          case types.ObjectExpression.name: // normal object literal
            amendPropTypes(documentation, resolvedValuePath)
            break
        }
        break
    }
  })
}

export default function propTypeHandler(documentation, path) {
  var propTypesPath = getMemberValuePath(path, 'props')
  if (!propTypesPath) {
    return
  }
  propTypesPath = resolveToValue(propTypesPath)
  if (!propTypesPath) {
    return
  }
  amendPropTypes(documentation, propTypesPath)
}
