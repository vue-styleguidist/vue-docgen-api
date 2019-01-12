import * as bt from '@babel/types'
import { NodePath, visit } from 'ast-types'
import { BlockTag } from 'src/utils/blockTags'
import { Documentation } from '../Documentation'
import getDocblock from '../utils/getDocblock'
import getDoclets, { DocBlockTags } from '../utils/getDoclets'
import { DocBlockTagEvent, TypedParamTag } from '../utils/getEvents'

export default function eventHandler(documentation: Documentation, path: NodePath) {
  const events: { [eventName: string]: DocBlockTagEvent } = documentation.get('events') || {}
  visit(path, {
    visitCallExpression(pathExpression: NodePath<bt.CallExpression>) {
      const node = pathExpression.node
      if (
        bt.isMemberExpression(node.callee) &&
        bt.isThisExpression(node.callee.object) &&
        bt.isIdentifier(node.callee.property) &&
        node.callee.property.name === '$emit'
      ) {
        const args = node.arguments
        const firstArg = args[0]
        let eventName: string

        if (args.length && bt.isLiteral(firstArg)) {
          eventName = (firstArg as bt.StringLiteral).value
        } else {
          return false
        }

        if (events[eventName]) {
          return
        }

        // fetch the leading comments on the wrapping expression
        const docblock = getDocblock(pathExpression.parent)
        const evtDescriptor = getEventDescriptor(eventName, getDoclets(docblock || ''))
        if (args.length > 1 && !evtDescriptor.properties) {
          evtDescriptor.properties = []
        }
        if (evtDescriptor.properties && evtDescriptor.properties.length < args.length - 1) {
          let i = args.length - 1 - evtDescriptor.properties.length
          while (i--) {
            evtDescriptor.properties.push({
              type: { names: ['undefined'] },
              name: '<anonymous>',
            })
          }
        }
        events[eventName] = evtDescriptor
      }
      return false
    },
  })
  documentation.set('events', events)
}

export function getEventDescriptor(eventName: string, jsDoc: DocBlockTags): DocBlockTagEvent {
  const eventDescriptor: DocBlockTagEvent = {
    description: jsDoc.description || '',
    properties: undefined,
  }

  const nonNullTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : []

  const typeTags = nonNullTags.filter((tg) => tg.title === 'type')
  eventDescriptor.type = typeTags.length
    ? { names: typeTags.map((t: TypedParamTag) => t.type.name) }
    : undefined

  const propertyTags = nonNullTags.filter((tg) => tg.title === 'property')
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
