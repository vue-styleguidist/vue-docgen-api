import doctrine from 'doctrine'
import getDocblock from '../utils/getDocblock'

export default function propHandler(documentation, path) {
  const docBlock = getDocblock(path.parentPath)

  // if no prop return
  if (!docBlock || !docBlock.length) {
    return
  }

  const jsDoc = doctrine.parse(docBlock)

  if (jsDoc.description) {
    documentation.set('description', jsDoc.description)
  }

  if (jsDoc.comment) {
    documentation.set('comment', jsDoc.comment)
  }
}
