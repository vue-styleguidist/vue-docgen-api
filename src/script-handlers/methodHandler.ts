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
      .filter((propertyPath) => bt.isProperty(propertyPath.node))
      .filter((p: NodePath<bt.Property>) => p.node.key.name === 'methods')

    // if no method return
    if (!methodsPath.length) {
      documentation.set('methods', methods)
      return
    }

    const methodsObject = methodsPath[0].get('value')

    methodsObject
      .get('properties')
      .filter((propertyPath) => bt.isProperty(propertyPath.node))
      .forEach((methodPath: NodePath<bt.Property>) => {
        const doc = getMethodDescriptor(methodPath)
        if (doc) {
          methods.push(doc)
        }
      })
  }
  documentation.set('methods', methods)
}

export function getMethodDescriptor(method: NodePath<bt.Property>): MethodDescriptor | undefined {
  const methodDescriptor: MethodDescriptor = { name: '', description: '' }

  methodDescriptor.name = method.node.key.name

  const docBlock = getDocblock(method)

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
  describeParams(method, methodDescriptor, jsDocTags.filter((tag) => tag.title === 'param'))

  // returns
  describeReturns(method, methodDescriptor, jsDocTags.filter((t) => t.title === 'returns'))

  // tags
  methodDescriptor.tags = transformTagsIntoObject(jsDocTags)

  return methodDescriptor
}

function describeParams(
  methodPath: NodePath<bt.Property>,
  methodDescriptor: MethodDescriptor,
  jsDocParamTags: ParamTag[],
) {
  // if there is no parameter non need to parse them
  const fExp = methodPath.node.value
  if (fExp && bt.isFunctionExpression(fExp) && !fExp.params.length) {
    return
  }
  const params: Param[] = []
  if (fExp && bt.isFunctionExpression(fExp)) {
    fExp.params.forEach((par: bt.Identifier, i) => {
      const param: Param = { name: par.name }

      const jsDocTags = jsDocParamTags.filter((tag) => tag.name === param.name)
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
  }

  if (params.length) {
    methodDescriptor.params = params
  }
}

function describeReturns(
  methodPath: NodePath<bt.Property>,
  methodDescriptor: MethodDescriptor,
  jsDocReturnTags: ParamTag[],
) {
  if (jsDocReturnTags.length) {
    methodDescriptor.returns = jsDocReturnTags[0]
  }

  if (!methodDescriptor.returns || !methodDescriptor.returns.type) {
    const methodNode = methodPath.node.value
    if (
      methodNode &&
      (bt.isFunctionExpression(methodNode) || bt.isArrowFunctionExpression(methodNode))
    ) {
      if (methodNode.returnType) {
        const type = getTypeFromAnnotation(methodNode.returnType)
        if (type) {
          methodDescriptor.returns = methodDescriptor.returns || {}
          methodDescriptor.returns.type = type
        }
      }
    }
  }
}
