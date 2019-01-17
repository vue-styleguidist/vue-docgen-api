import { NodePath } from '@babel/traverse'
import * as bt from '@babel/types'
import { BlockTag, DocBlockTags, Documentation, EventDescriptor } from '../Documentation'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import { TypedParamTag } from '../utils/getEvents'

export default function eventHandler(documentation: Documentation, path: NodePath) {
  const events: { [eventName: string]: EventDescriptor } = documentation.get('events') || {}
  path.traverse({
    CallExpression(pathExpression) {
      if (
        bt.isMemberExpression(pathExpression.node.callee) &&
        bt.isThisExpression(pathExpression.node.callee.object) &&
        bt.isIdentifier(pathExpression.node.callee.property) &&
        pathExpression.node.callee.property.name === '$emit'
      ) {
        const args = pathExpression.get('arguments')
        if (!args.length) {
          return
        }

        const firstArg = args[0]
        let eventName: string

        if (!firstArg.isLiteral()) {
          return
        }

        eventName = (firstArg.node as bt.StringLiteral).value

        if (events[eventName]) {
          return
        }

        // fetch the leading comments on the wrapping expression
        const docblock = getDocblock(pathExpression.parentPath)
        const evtDescriptor = getEventDescriptor(getDoclets(docblock || ''))
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
    },
  })
  documentation.set('events', events)
}

export function getEventDescriptor(jsDoc: DocBlockTags): EventDescriptor {
  const eventDescriptor: EventDescriptor = {
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
