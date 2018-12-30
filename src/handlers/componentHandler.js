import recast from 'recast'
import transformTagsIntoObject from '../utils/transformTagsIntoObject'
import getDoclets from '../utils/getDoclets'
import getDocblock from '../utils/getDocblock'

const types = recast.types.namedTypes

export default function propHandler(documentation, path) {
  let componentCommentedPath = path.parent
  // in case of Vue.extend() structure
  if (types.CallExpression.check(componentCommentedPath.node)) {
    componentCommentedPath = componentCommentedPath.parent
  }
  const docBlock = getDocblock(componentCommentedPath)

  // if no prop return
  if (!docBlock || !docBlock.length) {
    return
  }

  const jsDoc = getDoclets(docBlock)

  documentation.set('comment', docBlock)

  documentation.set('description', jsDoc.description || '')

  documentation.set('tags', transformTagsIntoObject(jsDoc.tags))
}
