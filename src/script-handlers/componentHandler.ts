import { NodePath } from '@babel/traverse'
import { Documentation } from '../Documentation'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import transformTagsIntoObject from '../utils/transformTagsIntoObject'

export default function propHandler(documentation: Documentation, path: NodePath) {
  let componentCommentedPath = path.parentPath
  // in case of Vue.extend() structure
  if (componentCommentedPath.isCallExpression()) {
    componentCommentedPath = componentCommentedPath.parentPath
  } else if (componentCommentedPath.isDeclaration()) {
    const classDeclaration = componentCommentedPath.get('declaration')
    if (!Array.isArray(classDeclaration) && classDeclaration.isClassDeclaration()) {
      componentCommentedPath = classDeclaration
    }
  }
  const docBlock = getDocblock(componentCommentedPath)

  // if no prop return
  if (!docBlock || !docBlock.length) {
    return
  }

  const jsDoc = getDoclets(docBlock)

  documentation.set('description', jsDoc.description || '')

  documentation.set('tags', transformTagsIntoObject(jsDoc.tags || []))
}
