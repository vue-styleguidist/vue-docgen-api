export default function propHandler(documentation, path) {
  const propsTokens = path.get('properties').value.filter(p => p.key && p.key.name === 'props')
  const props = propsTokens.length ? propsTokens[0].value.properties : []
  props.forEach(prop => {
    const propDescriptor = documentation.getPropDescriptor(prop.key.name)
    if (prop.value.type === 'ObjectExpression') {
      const typeArray = prop.value.properties.filter(p => p.key && p.key.name === 'type')
      const propType = typeArray.length ? typeArray[0] : 0
      propDescriptor.type = propType.value.name
    }
  })
}
