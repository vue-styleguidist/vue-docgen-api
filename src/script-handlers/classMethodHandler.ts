import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { Documentation, MethodDescriptor } from '../Documentation'
import getMethodDescriptor from '../utils/getMethodDescriptor'

export default function methodHandler(documentation: Documentation, path: NodePath) {
  if (bt.isClassDeclaration(path.node)) {
    const methods: MethodDescriptor[] = documentation.get('methods') || []
    const allMethods = path
      .get('body', 'body')
      .filter((a: NodePath) => (a.node as any).type === 'MethodDefinition')

    allMethods.forEach((methodPath: NodePath<bt.Property>) => {
      const doc = getMethodDescriptor(methodPath)
      if (doc) {
        methods.push(doc)
      }
    })
    documentation.set('methods', methods)
  }
}
