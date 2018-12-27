import getDoclets from '../utils/getDoclets'
import getDocblock from '../utils/getDocblock'

export default function propHandler(documentation, path) {
  const docBlock = getDocblock(path.parentPath)

  // if no prop return
  if (!docBlock || !docBlock.length) {
    return
  }

  const jsDoc = getDoclets(docBlock)

  if (jsDoc.description) {
    documentation.set('description', jsDoc.description)
  }

  if (jsDoc.comment) {
    documentation.set('comment', docBlock)
  }

  if (jsDoc.tags) {
    documentation.set('tags', transformTags(jsDoc.tags))
  }
}

function transformTags(tags) {
  return tags.reduce((acc, i) => {
    acc[i.title] = i.content
    return acc
  }, {})
}
