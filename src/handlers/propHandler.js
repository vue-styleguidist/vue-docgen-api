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

  propsObject
    .get('properties')
    // filter non object properties
    .filter(p => types.Property.check(p.node))
    .forEach(prop => {
      const propDescriptor = documentation.getPropDescriptor(prop.get('key').node.name)
      const propValuePath = prop.get('value')
      const isObjectExpression = types.ObjectExpression.check(propValuePath.value)
      const isIdentifier = types.Identifier.check(propValuePath.value)
      if (isIdentifier || isObjectExpression) {
        // description
        const docBlock = getDocblock(prop)
        const jsDoc = docBlock ? getDoclets(docBlock) : { tags: [] }

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

        if (jsDoc.tags.some(t => t.title === 'model')) {
          const propDescriptorModel = documentation.getPropDescriptor('v-model')
          for (let propKey of Object.keys(propDescriptor)) {
            propDescriptorModel[propKey] = propDescriptor[propKey]
          }
        }
      }
    })
}

function describeType(propPropertiesPath, propDescriptor) {
  const typeArray = propPropertiesPath.filter(p => p.node.key.name === 'type')
  if (typeArray.length) {
    propDescriptor.type = getTypeFromTypePath(typeArray[0].get('value'))
  } else {
    // deduce the type from default expression
    const defaultArray = propPropertiesPath.filter(p => p.node.key.name === 'default')
    if (defaultArray.length) {
      propDescriptor.type = { name: typeof defaultArray[0].node.value.value }
    }
  }
}

function getTypeFromTypePath(typePath) {
  const typeNode = typePath.node
  return {
    name: types.ArrayExpression.check(typeNode)
      ? typeNode.elements.map(t => t.name.toLowerCase()).join('|')
      : typeNode.name.toLowerCase(),
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
    propDescriptor.defaultValue = { value: recast.print(defaultArray[0].get('value')).code }
  }
}
