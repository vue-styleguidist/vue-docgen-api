import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { BlockTag, DocBlockTags, Documentation, PropDescriptor } from '../Documentation'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import transformTagsIntoObject from '../utils/transformTagsIntoObject'

// tslint:disable-next-line:no-var-requires
import recast = require('recast')

type ValueLitteral = bt.StringLiteral | bt.BooleanLiteral | bt.NumericLiteral

export default function propHandler(documentation: Documentation, path: NodePath) {
  if (bt.isObjectExpression(path.node)) {
    const propsPath = path
      .get('properties')
      .filter((p: NodePath) => bt.isObjectProperty(p.node) && p.node.key.name === 'props')

    // if no prop return
    if (!propsPath.length) {
      return
    }

    const propsValuePath = propsPath[0].get('value')

    if (bt.isObjectExpression(propsValuePath.node)) {
      const objProp = propsValuePath.get('properties')

      // filter non object properties
      const objPropFiltered = objProp.filter((p: NodePath) => bt.isProperty(p.node)) as Array<
        NodePath<bt.Property>
      >
      objPropFiltered.forEach((prop) => {
        const propNode = prop.node

        // description
        const docBlock = getDocblock(prop)
        const jsDoc: DocBlockTags = docBlock ? getDoclets(docBlock) : { description: '', tags: [] }
        const jsDocTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : []

        // if it's the v-model describe it only as such
        const propName = jsDocTags.some((t) => t.title === 'model') ? 'v-model' : propNode.key.name

        const propDescriptor = documentation.getPropDescriptor(propName)
        const propValuePath = prop.get('value')

        propDescriptor.tags = jsDocTags.length ? transformTagsIntoObject(jsDocTags) : {}
        if (jsDoc.description) {
          propDescriptor.description = jsDoc.description
        }

        if (bt.isArrayExpression(propValuePath.node)) {
          // I am not sure this case is valid vuejs
          propDescriptor.type = { name: 'array' }
        } else if (bt.isObjectExpression(propValuePath.node)) {
          const propPropertiesPath = propValuePath
            .get('properties')
            .filter((p: NodePath) => bt.isObjectProperty(p.node)) as Array<
            NodePath<bt.ObjectProperty>
          >

          // type
          describeType(propPropertiesPath, propDescriptor)

          // required
          describeRequired(propPropertiesPath, propDescriptor)

          // default
          describeDefault(propPropertiesPath, propDescriptor)
        } else if (bt.isIdentifier(propValuePath.node)) {
          // contents of the prop is it's type
          propDescriptor.type = getTypeFromTypePath(propValuePath)
        }
      })
    } else if (bt.isArrayExpression(propsValuePath.node)) {
      propsValuePath
        .get('elements')
        .filter((e: NodePath) => bt.isStringLiteral(e.node))
        .forEach((e: NodePath<bt.StringLiteral>) => {
          const propDescriptor = documentation.getPropDescriptor(e.node.value)
          propDescriptor.type = { name: 'undefined' }
          propDescriptor.required = ''
        })
    }
  }
}

function describeType(
  propPropertiesPath: Array<NodePath<bt.ObjectProperty>>,
  propDescriptor: PropDescriptor,
) {
  const typeArray = propPropertiesPath.filter((p) => p.node.key.name === 'type')
  if (typeArray.length) {
    propDescriptor.type = getTypeFromTypePath(typeArray[0].get('value'))
  } else {
    // deduce the type from default expression
    const defaultArray = propPropertiesPath.filter((p) => p.node.key.name === 'default')
    if (defaultArray.length) {
      const typeNode = defaultArray[0].node
      const func =
        bt.isArrowFunctionExpression(typeNode.value) || bt.isFunctionExpression(typeNode.value)
      const typeValueNode = defaultArray[0].get('value').node as ValueLitteral
      const typeName = typeof typeValueNode.value
      propDescriptor.type = { name: func ? 'func' : typeName }
    }
  }
}

function getTypeFromTypePath(typePath: NodePath): { name: string; func?: boolean } {
  const typeNode = typePath.node
  const typeName = bt.isArrayExpression(typeNode)
    ? typeNode.elements
        .map((t) => (t && bt.isIdentifier(t) ? t.name.toLowerCase() : 'undefined'))
        .join('|')
    : typeNode && bt.isIdentifier(typeNode)
    ? typeNode.name.toLowerCase()
    : 'undefined'
  return {
    name: typeName === 'function' ? 'func' : typeName,
  }
}

export function describeRequired(
  propPropertiesPath: Array<NodePath<bt.ObjectProperty>>,
  propDescriptor: PropDescriptor,
) {
  const requiredArray = propPropertiesPath.filter((p) => p.node.key.name === 'required')
  const requiredNode = requiredArray.length ? requiredArray[0].get('value').node : undefined
  propDescriptor.required =
    requiredNode && bt.isBooleanLiteral(requiredNode) ? requiredNode.value : ''
}

export function describeDefault(
  propPropertiesPath: Array<NodePath<bt.ObjectProperty>>,
  propDescriptor: PropDescriptor,
) {
  const defaultArray = propPropertiesPath.filter((p) => p.node.key.name === 'default')
  if (defaultArray.length) {
    const defaultPath = defaultArray[0].get('value')

    const func =
      bt.isArrowFunctionExpression(defaultPath.node) || bt.isFunctionExpression(defaultPath.node)
    propDescriptor.defaultValue = {
      func,
      value: recast.print(defaultPath).code,
    }
  }
}
