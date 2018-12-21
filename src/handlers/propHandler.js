import recast from 'recast'
import { getDocblock } from '../utils/commentDocblock'

export default function propHandler(documentation, path) {
  const propsTokens = path.get('properties').value.filter(p => p.key && p.key.name === 'props')
  const props = propsTokens.length ? propsTokens[0].value.properties : []
  props.forEach(prop => {
    const propDescriptor = documentation.getPropDescriptor(prop.key.name)

    if (prop.value.type === 'ObjectExpression') {
      // description
      describeComment(prop, propDescriptor)

      // type
      describeType(prop, propDescriptor)

      // required
      describeRequired(prop, propDescriptor)

      // default
      describeDefault(prop, propDescriptor)
    }
  })
}

function describeComment(prop, propDescriptor) {
  propDescriptor.description = getDocblock(prop)
}

function describeType(prop, propDescriptor) {
  const typeArray = prop.value.properties.filter(p => p.key && p.key.name === 'type')
  if (typeArray.length) {
    propDescriptor.type = typeArray[0].value.name
  }
}

function describeRequired(prop, propDescriptor) {
  const requiredArray = prop.value.properties.filter(p => p.key && p.key.name === 'required')
  if (requiredArray.length) {
    propDescriptor.required = requiredArray[0].value.value
  }
}

function describeDefault(prop, propDescriptor) {
  const defaultArray = prop.value.properties.filter(p => p.key && p.key.name === 'default')
  if (defaultArray.length) {
    propDescriptor.defaultValue = recast.print(defaultArray[0].value).code
  }
}
