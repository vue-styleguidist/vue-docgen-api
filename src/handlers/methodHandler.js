import recast from 'recast'
import { getDocblock } from '../utils/getDocblock'

const types = recast.types.namedTypes

export default function methodHandler(documentation, path) {
  const methodsPath = path
    .get('properties')
    .filter(propertyPath => types.Property.check(propertyPath.node))
    .filter(p => p.node.key.name === 'methods')

  // if no method return
  if (!methodsPath.length) {
    return
  }

  const methodsObject = methodsPath[0].get('value')

  const methods = []

  methodsObject
    .get('properties')
    .filter(
      propertyPath =>
        types.ObjectMethod.check(propertyPath.node) ||
        (types.ObjectProperty.check(propertyPath.node) &&
          types.FunctionExpression.check(propertyPath.node))
    )
    .forEach(method => {
      const methodDescriptor = {}

      // description
      methodDescriptor.description = getDocblock(method)

      // params
      describeParams(method, methodDescriptor)

      methods.push(methodDescriptor)
    })
  if (methods.length) {
    documentation.set('methods', methods)
  }
}

function describeParams(methodPath, methodDescriptor) {
  const params = []
  // here the parameters of the method will be described
  methodDescriptor.params = params
}
