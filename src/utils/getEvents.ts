import * as bt from '@babel/types'
import { DocBlockTagEvent } from '../Documentation'
import { getEventDescriptor } from '../script-handlers/eventHandler'
import { BlockTag } from './blockTags'
import { parseDocblock } from './getDocblock'
import getDoclets, { ParamTag, ParamType, Tag } from './getDoclets'

export interface TypedParamTag extends ParamTag {
  type: ParamType
}

export default function getEvents(
  ast: bt.File,
  events: { [eventName: string]: DocBlockTagEvent },
): { [eventName: string]: DocBlockTagEvent } {
  if (Array.isArray(ast.comments)) {
    const eventCommentBlocksDoclets = ast.comments.reduce((acc, comment: bt.Comment) => {
      // only observe block comments
      if (comment.type !== 'CommentBlock') {
        return acc
      }

      const docblock = parseDocblock(comment.value)

      const jsDoc = getDoclets(docblock)

      // filter comments where a tag is @event
      const nonNullTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : []
      const eventTag = nonNullTags.filter((t: BlockTag) => t.title === 'event')

      if (!eventTag.length) {
        return acc
      }

      const eventTagContent = (eventTag[0] as Tag).content
      const eventName = typeof eventTagContent === 'string' ? eventTagContent : undefined
      if (eventName) {
        acc[eventName] = getEventDescriptor(eventName, jsDoc)
      }
      return acc
    }, events || {})

    return eventCommentBlocksDoclets
  } else {
    return {}
  }
}
