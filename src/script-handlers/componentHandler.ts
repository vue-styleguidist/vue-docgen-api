import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { Documentation } from '../Documentation'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import transformTagsIntoObject from '../utils/transformTagsIntoObject'

export default function propHandler(documentation: Documentation, path: NodePath) {
  let componentCommentedPath = path.parentPath
  // in case of Vue.extend() structure
  if (bt.isCallExpression(componentCommentedPath.node)) {
    componentCommentedPath = componentCommentedPath.parentPath.parentPath
  } else if (bt.isDeclaration(componentCommentedPath.node)) {
    const classDeclaration = componentCommentedPath.get('declaration')
    if (bt.isClassDeclaration(classDeclaration.node)) {
      componentCommentedPath = classDeclaration
    }
  }
  const docBlock = getDocblock(componentCommentedPath)

  // if no prop return
  if (!docBlock || !docBlock.length) {
    return
  }

  const jsDoc = getDoclets(docBlock)

  documentation.set('description', jsDoc.description)

  documentation.set('tags', transformTagsIntoObject(jsDoc.tags || []))
}
