import { namedTypes as types, NodePath } from 'ast-types';
import getDocblock from '../utils/getDocblock';
import getDoclets, { DocBlockTags, ParamTag, Tag, Param } from '../utils/getDoclets';
import transformTagsIntoObject from '../utils/transformTagsIntoObject';
import { Documentation, MethodDescriptor } from 'src/Documentation';
import { isProperty, Property, isFunctionExpression, Identifier } from '@babel/types';

export default function methodHandler(documentation: Documentation, path: NodePath) {
  const methodsPath = path
    .get('properties')
    .filter((propertyPath) => isProperty(propertyPath.node))
    .filter((p: NodePath<Property>) => p.node.key.name === 'methods');

  const methods: MethodDescriptor[] = [];

  // if no method return
  if (!methodsPath.length) {
    documentation.set('methods', methods);
    return;
  }

  const methodsObject = methodsPath[0].get('value');

  methodsObject
    .get('properties')
    .filter((propertyPath) => isProperty(propertyPath.node))
    .forEach((method: NodePath<Property>) => {
      const methodDescriptor: MethodDescriptor = { name: '', description: '' };

      methodDescriptor.name = method.node.key.name;

      const docBlock = getDocblock(method);

      const jsDoc: DocBlockTags = docBlock ? getDoclets(docBlock) : { description: '', tags: [] };

      if (!jsDoc.tags.find((t) => t.title === 'public')) {
        return;
      }

      // params
      describeParams(method, methodDescriptor, jsDoc.tags.filter((tag) => tag.title === 'param'));

      // description
      if (jsDoc.description) {
        methodDescriptor.description = jsDoc.description;
      }

      // returns
      const tagReturns = jsDoc.tags.find((t) => t.title === 'returns');
      if (tagReturns) {
        methodDescriptor.returns = tagReturns;
      }

      // tags
      methodDescriptor.tags = transformTagsIntoObject(jsDoc.tags);

      methods.push(methodDescriptor);
    });
  documentation.set('methods', methods);
}

function describeParams(
  methodPath: NodePath<Property>,
  methodDescriptor: MethodDescriptor,
  jsDocParamTags: ParamTag[],
) {
  // if there is no parameter non need to parse them
  const fExp = methodPath.node.value;
  if (fExp && isFunctionExpression(fExp) && !fExp.params.length) {
    return;
  }
  const params: Param[] = [];
  if (fExp && isFunctionExpression(fExp)) {
    fExp.params.forEach((par: Identifier, i) => {
      const param: Param = { name: par.name };

      let jsDocTag = jsDocParamTags.find((tag) => tag.name === param.name);

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

      params.push(param);
    });
  }

  if (params.length) {
    methodDescriptor.params = params;
  }
}
