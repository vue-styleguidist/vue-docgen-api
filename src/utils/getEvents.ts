import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { BlockTag, EventDescriptor, ParamTag, ParamType, Tag } from '../Documentation'
import { getEventDescriptor } from '../script-handlers/eventHandler'
import { parseDocblock } from './getDocblock'
import getDoclets from './getDoclets'

// tslint:disable-next-line:no-var-requires
import recast = require('recast')

export interface TypedParamTag extends ParamTag {
  type: ParamType
}

export default function getEvents(
  ast: bt.File,
  events: { [eventName: string]: EventDescriptor },
): { [eventName: string]: EventDescriptor } {
  const eventCommentBlocksDoclets: { [eventName: string]: EventDescriptor } = events
  recast.visit(ast.program, {
    visitComment(path: NodePath) {
      const comment = path.node.leadingComments && path.node.leadingComments[0]
      // only observe block comments
      if (!comment || comment.type !== 'CommentBlock') {
        return false
      }

      const docblock = parseDocblock(comment.value)

      const jsDoc = getDoclets(docblock)

      // filter comments where a tag is @event
      const nonNullTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : []
      const eventTag = nonNullTags.filter(t => t.title === 'event')

      if (!eventTag.length) {
        return false
      }

      const eventTagContent = (eventTag[0] as Tag).content
      const eventName = typeof eventTagContent === 'string' ? eventTagContent : undefined
      if (eventName) {
        eventCommentBlocksDoclets[eventName] = getEventDescriptor(jsDoc)
      }
      return false
    },
  })

  return eventCommentBlocksDoclets
}
