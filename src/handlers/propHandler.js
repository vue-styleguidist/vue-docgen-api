import recast from 'recast'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import transformTagsIntoObject from '../utils/transformTagsIntoObject'

const types = recast.types.namedTypes

export default function propHandler(documentation, path) {
  const propsPath = path.get('properties').filter(p => p.node.key.name === 'props')

  // if no prop return
  if (!propsPath.length) {
    return
  }

  const propsObject = propsPath[0].get('value')

  if (types.ObjectExpression.check(propsObject.node)) {
    propsObject
      .get('properties')
      // filter non object properties
      .filter(p => types.Property.check(p.node))
      .forEach(prop => {
        // description
        const docBlock = getDocblock(prop)
        const jsDoc = docBlock ? getDoclets(docBlock) : { tags: [] }

        // if it's the v-model describe it as such
        const propName = jsDoc.tags.some(t => t.title === 'model')
          ? 'v-model'
          : prop.get('key').node.name

        const propDescriptor = documentation.getPropDescriptor(propName)
        const propValuePath = prop.get('value')
        const isObjectExpression = types.ObjectExpression.check(propValuePath.value)
        const isIdentifier = types.Identifier.check(propValuePath.value)
        if (isIdentifier || isObjectExpression) {
          if (jsDoc.tags.length) {
            propDescriptor.tags = transformTagsIntoObject(jsDoc.tags)
          }

          propDescriptor.description = jsDoc.description

          if (isObjectExpression) {
            const propPropertiesPath = propValuePath.get('properties')
            // type
            describeType(propPropertiesPath, propDescriptor)

            // required
            describeRequired(propPropertiesPath, propDescriptor)

            // default
            describeDefault(propPropertiesPath, propDescriptor)
          } else if (isIdentifier) {
            // contents of the prop is it's type
            propDescriptor.type = getTypeFromTypePath(propValuePath)
          }
        }
      })
  } else if (types.ArrayExpression.check(propsObject.node)) {
    propsObject
      .get('elements')
      .value.filter(e => types.Literal.check(e))
      .forEach(e => {
        const propDescriptor = documentation.getPropDescriptor(e.value)
        propDescriptor.type = { name: 'any' }
      })
  }
}

function describeType(propPropertiesPath, propDescriptor) {
  const typeArray = propPropertiesPath.filter(p => p.node.key.name === 'type')
  if (typeArray.length) {
    propDescriptor.type = getTypeFromTypePath(typeArray[0].get('value'))
  } else {
    // deduce the type from default expression
    const defaultArray = propPropertiesPath.filter(p => p.node.key.name === 'default')
    if (defaultArray.length) {
      const func =
        types.ArrowFunctionExpression.check(defaultArray[0].node.value) ||
        types.FunctionExpression.check(defaultArray[0].node.value)
      const typeName = typeof defaultArray[0].node.value.value
      propDescriptor.type = { name: func ? 'func' : typeName }
    }
  }
}

function getTypeFromTypePath(typePath) {
  const typeNode = typePath.node
  const typeName = types.ArrayExpression.check(typeNode)
    ? typeNode.elements.map(t => t.name.toLowerCase()).join('|')
    : typeNode.name.toLowerCase()
  return {
    name: typeName === 'function' ? 'func' : typeName,
  }
}

function describeRequired(propPropertiesPath, propDescriptor) {
  const requiredArray = propPropertiesPath.filter(p => p.node.key.name === 'required')
  if (requiredArray.length) {
    propDescriptor.required = requiredArray[0].get('value').node.value
  }
}

function describeDefault(propPropertiesPath, propDescriptor) {
  const defaultArray = propPropertiesPath.filter(p => p.node.key.name === 'default')
  if (defaultArray.length) {
    const defaultNode = defaultArray[0].get('value')
    const func =
      types.ArrowFunctionExpression.check(defaultNode.node) ||
      types.FunctionExpression.check(defaultNode.node)
    propDescriptor.defaultValue = {
      func,
      value: recast
        .print(defaultNode)
        .code.replace(/[\n\r]/g, '')
        .replace(/  /g, ' '),
    }
  }
}
