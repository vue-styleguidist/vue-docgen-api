import { namedTypes as types } from 'ast-types'
import getDoclets from './getDoclets'
import { parseDocblock } from './getDocblock'

export default function getEvents(ast) {
  if (Array.isArray(ast.comments)) {
    const eventCommentBlocksDoclets = ast.comments.reduce((acc, comment) => {
      // only observe block comments
      if (!types.CommentBlock.check(comment)) {
        return acc
      }

      const doc = getDoclets(parseDocblock(comment.value))

      // filter comments where a tag is @event
      const eventTag = doc.tags.find(t => t.title === 'event')
      if (eventTag) {
        const typeTags = doc.tags.filter(t => t.title === 'type')
        if (typeTags.length) {
          doc.type = { names: typeTags.map(t => t.type.name) }
        }
        acc[eventTag.content] = doc
      }
      return acc
    }, [])
    // make objects for it
    return eventCommentBlocksDoclets
  } else {
    return []
  }
}
