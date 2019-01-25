import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import {
  BlockTag,
  DocBlockTags,
  Documentation,
  EventDescriptor,
  ParamTag,
  ParamType,
} from '../Documentation'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'

export interface TypedParamTag extends ParamTag {
  type: ParamType
}

// tslint:disable-next-line:no-var-requires
import recast = require('recast')

export default function eventHandler(documentation: Documentation, path: NodePath) {
  recast.visit(path, {
    visitCallExpression(pathExpression: NodePath<bt.CallExpression>) {
      if (
        bt.isMemberExpression(pathExpression.node.callee) &&
        bt.isThisExpression(pathExpression.node.callee.object) &&
        bt.isIdentifier(pathExpression.node.callee.property) &&
        pathExpression.node.callee.property.name === '$emit'
      ) {
        const args = pathExpression.node.arguments
        if (!args.length) {
          return false
        }

        const firstArg = args[0]
        if (!bt.isStringLiteral(firstArg)) {
          return false
        }

        const eventName = firstArg.value

        // if this event is documented somewhere else leave it alone
        const evtDescriptor = documentation.getEventDescriptor(eventName)

        // fetch the leading comments on the wrapping expression
        const docblock = getDocblock(pathExpression.parentPath)
        setEventDescriptor(evtDescriptor, getDoclets(docblock || ''))

        if (args.length > 1 && !evtDescriptor.type) {
          evtDescriptor.type = {
            names: ['undefined'],
          }
        }

        if (args.length > 2 && !evtDescriptor.properties) {
          evtDescriptor.properties = []
        }
        if (evtDescriptor.properties && evtDescriptor.properties.length < args.length - 2) {
          let i = args.length - 2 - evtDescriptor.properties.length
          while (i--) {
            evtDescriptor.properties.push({
              type: { names: ['undefined'] },
              name: `<anonymous${args.length - i - 2}>`,
            })
          }
        }
        return false
      }
      this.traverse(pathExpression)
    },
  })
}

export function setEventDescriptor(
  eventDescriptor: EventDescriptor,
  jsDoc: DocBlockTags,
): EventDescriptor {
  eventDescriptor.description = jsDoc.description || ''

  const nonNullTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : []

  const typeTags = nonNullTags.filter(tg => tg.title === 'type')
  eventDescriptor.type = typeTags.length
    ? { names: typeTags.map((t: TypedParamTag) => t.type.name) }
    : undefined

  const propertyTags = nonNullTags.filter(tg => tg.title === 'property')
  if (propertyTags.length) {
    eventDescriptor.properties = propertyTags.map((tg: TypedParamTag) => {
      return { type: { names: [tg.type.name] }, name: tg.name, description: tg.description }
    })
  }

  // remove the property an type tags from the tag array
  const tags = nonNullTags.filter(
    (tg: BlockTag) => tg.title !== 'type' && tg.title !== 'property' && tg.title !== 'event',
  )

  if (tags.length) {
    eventDescriptor.tags = tags
  } else {
    delete eventDescriptor.tags
  }

  return eventDescriptor
}
