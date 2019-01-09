import { NodePath } from 'ast-types';
import getDocblock from '../utils/getDocblock';
import getDoclets, { DocBlockTags, ParamTag, Param, ParamType } from '../utils/getDoclets';
import transformTagsIntoObject from '../utils/transformTagsIntoObject';
import { Documentation, MethodDescriptor } from '../Documentation';
import * as bt from '@babel/types';
import { BlockTag } from '../utils/blockTags';

export default function methodHandler(documentation: Documentation, path: NodePath) {
  const methodsPath = path
    .get('properties')
    .filter((propertyPath) => bt.isProperty(propertyPath.node))
    .filter((p: NodePath<bt.Property>) => p.node.key.name === 'methods');

  const methods: MethodDescriptor[] = [];

  // if no method return
  if (!methodsPath.length) {
    documentation.set('methods', methods);
    return;
  }

  const methodsObject = methodsPath[0].get('value');

  methodsObject
    .get('properties')
    .filter((propertyPath) => bt.isProperty(propertyPath.node))
    .forEach((method: NodePath<bt.Property>) => {
      const methodDescriptor: MethodDescriptor = { name: '', description: '' };

      methodDescriptor.name = method.node.key.name;

      const docBlock = getDocblock(method);

      const jsDoc: DocBlockTags = docBlock ? getDoclets(docBlock) : { description: '', tags: [] };
      const jsDocTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : [];

      // ignore the method if there is no public tag
      if (!jsDocTags.some((t) => t.title === 'public')) {
        return;
      }

      // description
      if (jsDoc.description) {
        methodDescriptor.description = jsDoc.description;
      }

      // params
      describeParams(method, methodDescriptor, jsDocTags.filter((tag) => tag.title === 'param'));

      // returns
      describeReturns(method, methodDescriptor, jsDocTags.filter((t) => t.title === 'returns'));

      // tags
      methodDescriptor.tags = transformTagsIntoObject(jsDocTags);

      methods.push(methodDescriptor);
    });
  documentation.set('methods', methods);
}

function describeParams(
  methodPath: NodePath<bt.Property>,
  methodDescriptor: MethodDescriptor,
  jsDocParamTags: ParamTag[],
) {
  // if there is no parameter non need to parse them
  const fExp = methodPath.node.value;
  if (fExp && bt.isFunctionExpression(fExp) && !fExp.params.length) {
    return;
  }
  const params: Param[] = [];
  if (fExp && bt.isFunctionExpression(fExp)) {
    fExp.params.forEach((par: bt.Identifier, i) => {
      const param: Param = { name: par.name };

      const jsDocTags = jsDocParamTags.filter((tag) => tag.name === param.name);
      let jsDocTag = jsDocTags.length ? jsDocTags[0] : undefined;

      // if tag is not namely described try finding it by its order
      if (!jsDocTag) {
        if (jsDocParamTags[i] && !jsDocParamTags[i].name) {
          jsDocTag = jsDocParamTags[i];
        }
      }

      if (jsDocTag) {
        if (jsDocTag.type) {
          param.type = jsDocTag.type;
        }
        if (jsDocTag.description) {
          param.description = jsDocTag.description;
        }
      }

      if (!param.type && par.typeAnnotation) {
        const tsType = bt.isTSTypeAnnotation(par.typeAnnotation)
          ? par.typeAnnotation.typeAnnotation
          : undefined;
        if (tsType) {
          param.type = getTypeObjectFromTSType(tsType);
        } else if (bt.isTypeAnnotation(par.typeAnnotation)) {
          const flowType = par.typeAnnotation.typeAnnotation;
          if (flowType) {
            param.type = getTypeObjectFromFlowType(flowType);
          }
        }
      }

      params.push(param);
    });
  }

  if (params.length) {
    methodDescriptor.params = params;
  }
}

function describeReturns(
  methodPath: NodePath<bt.Property>,
  methodDescriptor: MethodDescriptor,
  jsDocReturnTags: ParamTag[],
) {
  if (jsDocReturnTags.length) {
    methodDescriptor.returns = jsDocReturnTags[0];
  }

  if (!methodDescriptor.returns || !methodDescriptor.returns.type) {
    const methodNode = methodPath.node.value;
    if (
      methodNode &&
      (bt.isFunctionExpression(methodNode) || bt.isArrowFunctionExpression(methodNode))
    ) {
      if (methodNode.returnType) {
        if (bt.isTSTypeAnnotation(methodNode.returnType)) {
          methodDescriptor.returns = methodDescriptor.returns || {};
          methodDescriptor.returns.type = getTypeObjectFromTSType(
            methodNode.returnType.typeAnnotation,
          );
        }
      }
    }
  }
}

const TS_TYPE_NAME_MAP: { [name: string]: string } = {
  TSAnyKeyword: 'any',
  TSUnknownKeyword: 'unknown',
  TSNumberKeyword: 'number',
  TSObjectKeyword: 'object',
  TSBooleanKeyword: 'boolean',
  TSStringKeyword: 'string',
  TSSymbolKeyword: 'symbol',
  TSVoidKeyword: 'void',
  TSUndefinedKeyword: 'undefined',
  TSNullKeyword: 'null',
  TSNeverKeyword: 'never',
};

function getTypeObjectFromTSType(type: bt.TSType): ParamType {
  const name =
    bt.isTSTypeReference(type) && bt.isIdentifier(type.typeName)
      ? type.typeName.name
      : TS_TYPE_NAME_MAP[type.type]
      ? TS_TYPE_NAME_MAP[type.type]
      : type.type;

  return { name };
}

const FLOW_TYPE_NAME_MAP: { [name: string]: string } = {
  AnyTypeAnnotation: 'any',
  UnknownTypeAnnotation: 'unknown',
  NumberTypeAnnotation: 'number',
  ObjectTypeAnnotation: 'object',
  BooleanTypeAnnotation: 'boolean',
  StringTypeAnnotation: 'string',
  SymbolTypeAnnotation: 'symbol',
  VoidTypeAnnotation: 'void',
  UndefinedTypeAnnotation: 'undefined',
  NullTypeAnnotation: 'null',
  NeverTypeAnnotation: 'never',
};

function getTypeObjectFromFlowType(type: bt.FlowType): ParamType {
  const name = FLOW_TYPE_NAME_MAP[type.type]
    ? FLOW_TYPE_NAME_MAP[type.type]
    : bt.isGenericTypeAnnotation(type)
    ? type.id.name
    : type.type;
  return { name };
}
