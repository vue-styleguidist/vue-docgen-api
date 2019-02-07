import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { Documentation, ParamTag, ParamType, Tag } from '../Documentation'
import getDoclets from '../utils/getDoclets'

export interface TypedParamTag extends ParamTag {
  type: ParamType
}

// tslint:disable-next-line:no-var-requires
import recast = require('recast')

export default function slotHandler(documentation: Documentation, path: NodePath) {
  if (bt.isObjectExpression(path.node)) {
    const renderPath = path
      .get('properties')
      .filter(
        (p: NodePath) =>
          (bt.isObjectProperty(p.node) || bt.isObjectMethod(p.node)) &&
          p.node.key.name === 'render',
      )

    // if no prop return
    if (!renderPath.length) {
      return
    }

    const renderValuePath = bt.isObjectProperty(renderPath[0].node)
      ? renderPath[0].get('value')
      : renderPath[0]
    recast.visit(renderValuePath, {
      visitCallExpression(pathCall: NodePath<bt.CallExpression>) {
        if (
          bt.isMemberExpression(pathCall.node.callee) &&
          bt.isMemberExpression(pathCall.node.callee.object) &&
          bt.isThisExpression(pathCall.node.callee.object.object) &&
          bt.isIdentifier(pathCall.node.callee.property) &&
          pathCall.node.callee.object.property.name === '$scopedSlots'
        ) {
          documentation.getSlotDescriptor(pathCall.node.callee.property.name)
          return false
        }
        this.traverse(pathCall)
      },
      visitMemberExpression(pathMember: NodePath<bt.MemberExpression>) {
        if (
          bt.isMemberExpression(pathMember.node.object) &&
          bt.isThisExpression(pathMember.node.object.object) &&
          bt.isIdentifier(pathMember.node.object.property) &&
          pathMember.node.object.property.name === '$slots' &&
          bt.isIdentifier(pathMember.node.property)
        ) {
          documentation.getSlotDescriptor(pathMember.node.property.name)
          return false
        }
        this.traverse(pathMember)
      },
      visitJSXElement(pathJSX: NodePath<bt.JSXElement>) {
        const tagName = pathJSX.node.openingElement.name
        if (bt.isJSXIdentifier(tagName) && tagName.name === 'slot') {
          const doc = documentation.getSlotDescriptor(getName(pathJSX))
          doc.description = getDescription(pathJSX)
        }
        this.traverse(pathJSX)
      },
    })
  }
}

function getName(pathJSX: NodePath<bt.JSXElement>): string {
  const oe = pathJSX.node.openingElement
  const names = oe.attributes.filter(
    (a: bt.JSXAttribute) => bt.isJSXAttribute(a) && a.name.name === 'name',
  ) as bt.JSXAttribute[]

  const nameNode = names.length ? names[0].value : null
  return nameNode && bt.isStringLiteral(nameNode) ? nameNode.value : 'default'
}

function getDescription(pathJSX: NodePath<bt.JSXElement>): string {
  let indexInParent = -1
  const siblings = (pathJSX.parentPath.node as bt.JSXElement).children
  if (!siblings) {
    return ''
  }
  siblings.forEach((node: bt.JSXElement, i: number) => {
    if (node === pathJSX.node) {
      indexInParent = i
    }
  })

  let commentExpression: bt.JSXExpressionContainer | null = null
  do {
    const currentNode = siblings[indexInParent]
    if (bt.isJSXExpressionContainer(currentNode)) {
      commentExpression = currentNode
    }
  } while (!commentExpression && indexInParent--)
  if (commentExpression && commentExpression.expression.innerComments) {
    const cmts = commentExpression.expression.innerComments
    const docBlock = cmts[cmts.length - 1].value.replace(/^\*/, '').trim()
    const jsDoc = getDoclets(docBlock)
    if (jsDoc.tags) {
      const slotTags = jsDoc.tags.filter(t => t.title === 'slot')
      if (slotTags.length) {
        return (slotTags[0] as Tag).content.toString()
      }
    }
  }
  return ''
}
