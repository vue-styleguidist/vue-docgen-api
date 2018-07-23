import getProp from './getProp'

export default function processProps(docFile, component) {
  docFile = docFile.slice()
  let props = component.props
  let mixins = component.mixins
  let propsMixins = {}
  if (mixins) {
    mixins.forEach(mixin => {
      const pMixin = mixin.props
      if (pMixin) {
        if (Array.isArray(pMixin)) {
          const propsMerge = {}
          pMixin.forEach(key => {
            propsMerge[key] = {}
          })
          propsMixins = Object.assign({}, propsMerge, propsMixins)
        } else {
          propsMixins = Object.assign({}, pMixin, propsMixins)
        }
      }
    })
  }

  const hasPropsInMixin = propsMixins && Object.keys(propsMixins).length
  const hasPropsInComponent = props && Object.keys(props).length
  if (hasPropsInMixin || hasPropsInComponent) {
    const listDocProps = {}
    if (Array.isArray(props)) {
      const newProps = {}
      props.forEach(propName => {
        newProps[propName] = {}
      })
      props = newProps
    }
    props = Object.assign({}, propsMixins, props)
    const listDocParts = []
    Object.keys(props).forEach(key => {
      let propName = key
      const docPart = docFile.filter(comment => {
        const propNameDoc = comment.longname.split('props.')[1]
        return propNameDoc === propName && listDocParts.indexOf(propNameDoc) === -1
      })[0]
      if (docPart) {
        listDocParts.push(docPart.longname)
      }
      const prop = props[propName]
      const docProp = getProp(prop, docPart)
      if (docProp.tags.model) {
        propName = 'v-model'
      }
      listDocProps[propName] = docProp
    })
    return listDocProps
  }
  return
}
