import recast from 'recast'
import doctrine from 'doctrine'
import { getDocblock } from '../utils/getDocblock'

const types = recast.types.namedTypes

export default function methodHandler(documentation, path) {
  const methodsPath = path
    .get('properties')
    .filter(propertyPath => types.Property.check(propertyPath.node))
    .filter(p => p.node.key.name === 'methods')

  // if no method return
  if (!methodsPath.length) {
    return
  }

  const methodsObject = methodsPath[0].get('value')

  const methods = []

  methodsObject
    .get('properties')
    .filter(propertyPath => types.Property.check(propertyPath.node))
    .forEach(method => {
      const methodDescriptor = {}

      methodDescriptor.name = method.node.key.name

      const docBlock = getDocblock(method)

      const jsDoc = doctrine.parse(docBlock || '')

      // params
      describeParams(method, methodDescriptor, jsDoc.tags.filter(tag => tag.title === 'param'))

      // description
      if (jsDoc.description.length) {
        methodDescriptor.description = jsDoc.description
      }

      methods.push(methodDescriptor)
    })
  if (methods.length) {
    documentation.set('methods', methods)
  }
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
      if (jsDocParamTags[i] && jsDocParamTags[i].name === 'null-null') {
        jsDocTag = jsDocParamTags[i]
      }
    }

    if (jsDocTag) {
      if (jsDocTag.type) {
        param.type = convertJsDocTypeToDocGen(jsDocTag.type)
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

/**
 * Adapts types coming out of doctrine into readable types
 * @param {Object} tagType
 */
function convertJsDocTypeToDocGen(tagType) {
  if (!tagType) {
    return null
  }

  const { type, name, expression, elements, applications } = tagType

  switch (type) {
    case 'NameExpression':
      // {a}
      return { name }
    case 'UnionType':
      // {a|b}
      return {
        name: 'union',
        elements: elements.map(element => convertJsDocTypeToDocGen(element)),
      }
    case 'AllLiteral':
      // {*}
      return { name: 'mixed' }
    case 'TypeApplication':
      // {Array<string>} or {string[]}
      return {
        name: expression.name,
        elements: applications.map(element => convertJsDocTypeToDocGen(element)),
      }
    case 'ArrayType':
      // {[number, string]}
      return {
        name: 'tuple',
        elements: elements.map(element => convertJsDocTypeToDocGen(element)),
      }
    default: {
      const typeName = name ? name : expression ? expression.name : null
      if (typeName) {
        return { name: typeName }
      } else {
        return null
      }
    }
  }
}
