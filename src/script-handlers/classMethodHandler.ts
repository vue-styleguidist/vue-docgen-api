import { NodePath } from '@babel/traverse'
import * as bt from '@babel/types'
import { Documentation, MethodDescriptor } from '../Documentation'
import { getMethodDescriptor } from './methodHandler'

export default function methodHandler(documentation: Documentation, path: NodePath) {
  if (path.isClassDeclaration()) {
    const methods: MethodDescriptor[] = documentation.get('methods') || []
    const allMethods = path
      .get('body')
      .get('body')
      .filter((a: NodePath) => a.isClassMethod())

    allMethods.forEach((methodPath: NodePath<bt.ClassMethod>) => {
      const methodName = bt.isIdentifier(methodPath.node.key)
        ? methodPath.node.key.name
        : '<anonymous>'
      const doc = getMethodDescriptor(methodPath, methodName)
      if (doc) {
        methods.push(doc)
      }
    })
    documentation.set('methods', methods)
  }
}
