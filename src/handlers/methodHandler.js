import { namedTypes as types } from 'ast-types'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'

export default function methodHandler(documentation, path) {
  const methodsPath = path
    .get('properties')
    .filter(propertyPath => types.Property.check(propertyPath.node))
    .filter(p => p.node.key.name === 'methods')

  const methods = []

  // if no method return
  if (!methodsPath.length) {
    documentation.set('methods', methods)
    return
  }

  const methodsObject = methodsPath[0].get('value')

  methodsObject
    .get('properties')
    .filter(propertyPath => types.Property.check(propertyPath.node))
    .forEach(method => {
      const methodDescriptor = {}

      methodDescriptor.name = method.node.key.name

      const docBlock = getDocblock(method)

      const jsDoc = docBlock ? getDoclets(docBlock) : { tags: [] }

      if (!jsDoc.tags.find(t => t.title === 'public')) {
        return
      }

      // params
      describeParams(method, methodDescriptor, jsDoc.tags.filter(tag => tag.title === 'param'))

      // description
      if (jsDoc.description) {
        methodDescriptor.description = jsDoc.description
      }

      methods.push(methodDescriptor)
    })
  documentation.set('methods', methods)
}

function describeParams(methodPath, methodDescriptor, jsDocParamTags) {
  // if there is no parameter non need to parse them
  if (!methodPath.node.value.params.length) {
    return
  }
  const params = []
  methodPath.node.value.params.forEach((par, i) => {
    const param = { name: par.name }

    let jsDocTag = jsDocParamTags.find(tag => tag.name === param.name)

    // if tag is not namely described try finding it by its order
    if (!jsDocTag) {
      if (jsDocParamTags[i] && !jsDocParamTags[i].name) {
        jsDocTag = jsDocParamTags[i]
      }
    }

    if (jsDocTag) {
      if (jsDocTag.type) {
        param.type = jsDocTag.type
      }
      if (jsDocTag.description) {
        param.description = jsDocTag.description
      }
    }

    params.push(param)
  })

  if (params.length) {
    methodDescriptor.params = params
  }
}
