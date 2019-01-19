import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import {
  BlockTag,
  DocBlockTags,
  Documentation,
  MethodDescriptor,
  Param,
  ParamTag,
  Tag,
} from '../Documentation'
import getDocblock from '../utils/getDocblock'
import getDoclets from '../utils/getDoclets'
import getTypeFromAnnotation from '../utils/getTypeFromAnnotation'
import transformTagsIntoObject from '../utils/transformTagsIntoObject'

export default function methodHandler(documentation: Documentation, path: NodePath) {
  const methods: MethodDescriptor[] = documentation.get('methods') || []

  if (bt.isObjectExpression(path.node)) {
    const methodsPath = path
      .get('properties')
      .filter(
        (p: NodePath) => bt.isObjectProperty(p.node) && p.node.key.name === 'methods',
      ) as Array<NodePath<bt.ObjectProperty>>

    // if no method return
    if (!methodsPath.length) {
      documentation.set('methods', methods)
      return
    }

    const methodsObject = methodsPath[0].get('value')
    if (bt.isObjectExpression(methodsObject.node)) {
      methodsObject.get('properties').each((p: NodePath) => {
        let methodName = '<anonymous>'
        if (bt.isObjectProperty(p.node)) {
          const val = p.get('value')
          methodName = p.node.key.name
          if (!Array.isArray(val)) {
            p = val
          }
        }
        if (bt.isFunction(p.node)) {
          methodName = bt.isObjectMethod(p.node) ? p.node.key.name : methodName
          const doc = getMethodDescriptor(p as NodePath<bt.Function>, methodName)
          if (doc) {
            methods.push(doc)
          }
        }
      })
    }
  }
  documentation.set('methods', methods)
}

export function getMethodDescriptor(
  method: NodePath<bt.Function>,
  methodName: string,
): MethodDescriptor | undefined {
  const methodDescriptor: MethodDescriptor = { name: methodName, description: '', modifiers: [] }

  const docBlock = getDocblock(
    bt.isObjectMethod(method.node) || bt.isClassMethod(method.node) ? method : method.parentPath,
  )

  const jsDoc: DocBlockTags = docBlock ? getDoclets(docBlock) : { description: '', tags: [] }
  const jsDocTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : []

  // ignore the method if there is no public tag
  if (!jsDocTags.some((t: Tag) => t.title === 'access' && t.content === 'public')) {
    return
  }

  // description
  if (jsDoc.description) {
    methodDescriptor.description = jsDoc.description
  }

  // params
  describeParams(method, methodDescriptor, jsDocTags.filter(tag => tag.title === 'param'))

  // returns
  describeReturns(method, methodDescriptor, jsDocTags.filter(t => t.title === 'returns'))

  // tags
  methodDescriptor.tags = transformTagsIntoObject(jsDocTags)

  return methodDescriptor
}

function describeParams(
  methodPath: NodePath<bt.Function>,
  methodDescriptor: MethodDescriptor,
  jsDocParamTags: ParamTag[],
) {
  // if there is no parameter no need to parse them
  const fExp = methodPath.node
  if (!fExp.params.length && !jsDocParamTags.length) {
    return
  }

  const params: Param[] = []
  fExp.params.forEach((par: bt.Identifier, i) => {
    const param: Param = { name: par.name }

    const jsDocTags = jsDocParamTags.filter(tag => tag.name === param.name)
    let jsDocTag = jsDocTags.length ? jsDocTags[0] : undefined

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

    if (!param.type && par.typeAnnotation) {
      const type = getTypeFromAnnotation(par.typeAnnotation)
      if (type) {
        param.type = type
      }
    }

    params.push(param)
  })

  // in case the arguments are abstracted (using the arguments keyword)
  if (!params.length) {
    jsDocParamTags.forEach(doc => {
      params.push(doc)
    })
  }

  if (params.length) {
    methodDescriptor.params = params
  }
}

function describeReturns(
  methodPath: NodePath<bt.Function>,
  methodDescriptor: MethodDescriptor,
  jsDocReturnTags: ParamTag[],
) {
  if (jsDocReturnTags.length) {
    methodDescriptor.returns = jsDocReturnTags[0]
  }

  if (!methodDescriptor.returns || !methodDescriptor.returns.type) {
    const methodNode = methodPath.node
    if (methodNode.returnType) {
      const type = getTypeFromAnnotation(methodNode.returnType)
      if (type) {
        methodDescriptor.returns = methodDescriptor.returns || {}
        methodDescriptor.returns.type = type
      }
    }
  }
}
