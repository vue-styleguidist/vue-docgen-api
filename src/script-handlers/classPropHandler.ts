import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { BlockTag, DocBlockTags, Documentation } from '../Documentation'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import getTypeFromAnnotation from '../utils/getTypeFromAnnotation'
import transformTagsIntoObject from '../utils/transformTagsIntoObject'
import { describeDefault, describeRequired } from './propHandler'

export default function propHandler(documentation: Documentation, path: NodePath) {
  if (bt.isClassDeclaration(path.node)) {
    path
      .get('body', 'body')
      .filter((p: NodePath) => bt.isClassProperty(p.node))
      .forEach((propPath: NodePath<bt.ClassProperty>) => {
        const propDeco = propPath.get('decorators').filter((p: NodePath<bt.Decorator>) => {
          const exp = bt.isCallExpression(p.node.expression)
            ? p.node.expression.callee
            : p.node.expression
          return bt.isIdentifier(exp) && exp.name === 'Prop'
        })

        if (!propDeco.length) {
          return
        }

        const propName = bt.isIdentifier(propPath.node.key) ? propPath.node.key.name : undefined
        if (!propName) {
          return
        }

        const propDescriptor = documentation.getPropDescriptor(propName)

        // description
        const docBlock = getDocblock(propPath)
        const jsDoc: DocBlockTags = docBlock ? getDoclets(docBlock) : { description: '', tags: [] }
        const jsDocTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : []
        if (jsDocTags) {
          propDescriptor.tags = transformTagsIntoObject(jsDocTags)
        }
        if (jsDoc.description) {
          propDescriptor.description = jsDoc.description
        }

        if (propPath.node.typeAnnotation) {
          propDescriptor.type = getTypeFromAnnotation(propPath.node.typeAnnotation)
        }

        const propDecoratorPath = propDeco[0].get('expression')
        if (bt.isCallExpression(propDecoratorPath.node)) {
          const propDecoratorArg = propDecoratorPath.get('arguments', 0)

          if (propDecoratorArg.node && bt.isObjectExpression(propDecoratorArg.node)) {
            describeDefault(propDecoratorArg.get('properties'), propDescriptor)
            describeRequired(propDecoratorArg.get('properties'), propDescriptor)
          }
        }
      })
  }
}
