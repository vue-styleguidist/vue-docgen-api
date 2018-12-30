import getDoclets from './getDoclets'
import { parseDocblock } from './getDocblock'

export default function getEvents(ast, recast) {
  const types = recast.types.namedTypes

  const eventCommentBlocksDoclets = {}

  recast.visit(ast, {
    visitComment: path => {
      const comment = path.node.comments[0]
      if (!types.CommentBlock.check(comment)) {
        return false
      }

      const doc = getDoclets(parseDocblock(comment.value))
      const eventTag = doc.tags.find(t => t.title === 'event')
      if (eventTag) {
        const typeTags = doc.tags.filter(t => t.title === 'type')
        if (typeTags.length) {
          doc.type = { names: typeTags.map(t => t.type.name) }
        }
        eventCommentBlocksDoclets[eventTag.content] = doc
      }
      return false
    },
  })

  // filter comments where a tag is @event
  /*const eventCommentBlocksDoclets = astComments
    .filter(path => types.CommentBlock.check(path))
    .map(path => getDoclets(path.value))
    .filter(d => d.tags.some(t => t.title === 'event'))*/

  // make objects for it
  return eventCommentBlocksDoclets
}
