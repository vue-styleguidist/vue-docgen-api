import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { Documentation, ParamTag, ParamType } from '../Documentation'

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
          const oe = pathJSX.node.openingElement
          const names = oe.attributes.filter(
            (a: bt.JSXAttribute) => bt.isJSXAttribute(a) && a.name.name === 'name',
          ) as bt.JSXAttribute[]

          const nameNode = names.length ? names[0].value : null
          const name = nameNode && bt.isStringLiteral(nameNode) ? nameNode.value : 'default'
          documentation.getSlotDescriptor(name)
        }
        this.traverse(pathJSX)
      },
    })
  }
}
