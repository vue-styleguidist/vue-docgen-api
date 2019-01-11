import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { Documentation, MethodDescriptor } from '../Documentation'
import getMethodDescriptor from '../utils/getMethodDescriptor'

export default function methodHandler(documentation: Documentation, path: NodePath) {
  const methods: MethodDescriptor[] = documentation.get('methods') || []

  if (bt.isObjectExpression(path.node)) {
    const methodsPath = path
      .get('properties')
      .filter((propertyPath) => bt.isProperty(propertyPath.node))
      .filter((p: NodePath<bt.Property>) => p.node.key.name === 'methods')

    // if no method return
    if (!methodsPath.length) {
      documentation.set('methods', methods)
      return
    }

    const methodsObject = methodsPath[0].get('value')

    methodsObject
      .get('properties')
      .filter((propertyPath) => bt.isProperty(propertyPath.node))
      .forEach((methodPath: NodePath<bt.Property>) => {
        const doc = getMethodDescriptor(methodPath)
        if (doc) {
          methods.push(doc)
        }
      })
  }
  documentation.set('methods', methods)
}
