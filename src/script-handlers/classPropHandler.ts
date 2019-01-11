import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { Documentation } from '../Documentation'

export default function propHandler(documentation: Documentation, path: NodePath) {
  if (bt.isClassDeclaration(path.node)) {
    // TODO: implement property detection in class style components
  }
}
