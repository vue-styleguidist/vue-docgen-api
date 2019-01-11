import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { Documentation, MethodDescriptor } from '../Documentation'

export default function methodHandler(documentation: Documentation, path: NodePath) {
  const methods: MethodDescriptor[] = documentation.get('methods') || []

  if (bt.isClassDeclaration(path.node)) {
    // TODO: implement public method detection in class style components
  }
  documentation.set('methods', methods)
}
