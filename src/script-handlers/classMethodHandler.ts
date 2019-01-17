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
      .filter((a: NodePath) => (a.node as any).type === 'MethodDefinition') as Array<
      NodePath<bt.Property>
    >

    allMethods.forEach((methodPath) => {
      const doc = getMethodDescriptor(methodPath)
      if (doc) {
        methods.push(doc)
      }
    })
    documentation.set('methods', methods)
  }
}
