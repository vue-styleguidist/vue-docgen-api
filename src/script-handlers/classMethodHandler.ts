import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { Documentation, MethodDescriptor } from '../Documentation'
import { setMethodDescriptor } from './methodHandler'

export default function methodHandler(documentation: Documentation, path: NodePath) {
  if (bt.isClassDeclaration(path.node)) {
    const methods: MethodDescriptor[] = documentation.get('methods') || []
    const allMethods = path
      .get('body')
      .get('body')
      .filter((a: NodePath) => bt.isClassMethod(a.node))

    allMethods.forEach((methodPath: NodePath<bt.ClassMethod>) => {
      const methodName = bt.isIdentifier(methodPath.node.key)
        ? methodPath.node.key.name
        : '<anonymous>'
      const doc = documentation.getMethodDescriptor(methodName)
      setMethodDescriptor(doc, methodPath)
    })
    documentation.set('methods', methods)
  }
}
