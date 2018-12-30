import transformTagsIntoObject from '../utils/transformTagsIntoObject'
import getDoclets from '../utils/getDoclets'
import getDocblock from '../utils/getDocblock'

export default function propHandler(documentation, path) {
  const docBlock = getDocblock(path.parentPath)

  // if no prop return
  if (!docBlock || !docBlock.length) {
    return
  }

  const jsDoc = getDoclets(docBlock)

  documentation.set('comment', docBlock)

  documentation.set('description', jsDoc.description || '')

  documentation.set('tags', transformTagsIntoObject(jsDoc.tags))
}
