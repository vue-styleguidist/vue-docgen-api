import recast from 'recast'
import { getDocblock } from '../utils/getDocblock'

const {
  types: { namedTypes: types },
} = recast

export default function methodHandler(documentation, path) {
  const methodsPath = path
    .get('properties')
    .filter(propertyPath => types.Property.check(propertyPath.node))
    .filter(p => p.node.key.name === 'methods')

  // if no prop return
  if (!methodsPath.length) {
    return
  }

  const methodsObject = methodsPath[0].get('value')

  methodsObject
    .get('properties')
    .filter(
      propertyPath =>
        types.ObjectMethod.check(propertyPath.node) ||
        (types.ObjectProperty.check(propertyPath.node) &&
          types.FunctionExpression.check(propertyPath.node))
    )
    .forEach(method => {
      const methodDescriptor = documentation.getPropDescriptor(method.get('key').name)

      // description
      methodDescriptor.description = getDocblock(method)

      const propPropertiesPath = method.get('value').get('properties')

      // default
      describeParams(propPropertiesPath, methodDescriptor)
    })
}

function describeParams(propPropertiesPath, propDescriptor) {
  const defaultArray = propPropertiesPath.filter(p => p.node.key.name === 'default')
  if (defaultArray.length) {
    propDescriptor.defaultValue = recast.print(defaultArray[0].get('value')).code
  }
}
