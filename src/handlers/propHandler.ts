import { generate } from 'escodegen';
import { NodePath } from 'ast-types';
import getDocblock from '../utils/getDocblock';
import getDoclets, { DocBlockTags } from '../utils/getDoclets';
import transformTagsIntoObject from '../utils/transformTagsIntoObject';
import {
  isObjectExpression,
  isProperty,
  isIdentifier,
  isArrayExpression,
  ObjectProperty,
  StringLiteral,
  isArrowFunctionExpression,
  isFunctionExpression,
  BooleanLiteral,
  NumericLiteral,
  isLiteral,
  Property,
} from '@babel/types';
import { Documentation, PropDescriptor } from 'src/Documentation';
import { BlockTag } from 'src/utils/blockTags';

type ValueLitteral = StringLiteral | BooleanLiteral | NumericLiteral;

export default function propHandler(documentation: Documentation, path: NodePath) {
  const propsPath = path
    .get('properties')
    .filter((p) => isProperty(p.node) && p.node.key.name === 'props');

  // if no prop return
  if (!propsPath.length) {
    return;
  }

  const propsObject = propsPath[0].get('value');

  if (isObjectExpression(propsObject.node)) {
    propsObject
      .get('properties')
      // filter non object properties
      .filter((p: NodePath) => isProperty(p.node))
      .forEach((prop) => {
        const propNode = prop.node as Property;

        // description
        const docBlock = getDocblock(prop);
        const jsDoc: DocBlockTags = docBlock ? getDoclets(docBlock) : { description: '', tags: [] };
        const jsDocTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : [];

        // if it's the v-model describe it only as such
        const propName = jsDocTags.some((t) => t.title === 'model') ? 'v-model' : propNode.key.name;

        const propDescriptor = documentation.getPropDescriptor(propName);
        const propValuePath = prop.get('value');
        const objectExpression = isObjectExpression(propValuePath.node);
        const identifier = isIdentifier(propValuePath.node);
        const isTupple = isArrayExpression(propValuePath.node);
        if (identifier || objectExpression || isTupple) {
          propDescriptor.tags = jsDocTags.length ? transformTagsIntoObject(jsDocTags) : {};
          if (jsDoc.description) {
            propDescriptor.description = jsDoc.description;
          }

          if (objectExpression) {
            const propPropertiesPath = propValuePath.get('properties') as NodePath<ObjectProperty>;
            // type
            describeType(propPropertiesPath, propDescriptor);

            // required
            describeRequired(propPropertiesPath, propDescriptor);

            // default
            describeDefault(propPropertiesPath, propDescriptor);
          } else if (isIdentifier) {
            // contents of the prop is it's type
            propDescriptor.type = getTypeFromTypePath(propValuePath);
          } else if (isTupple) {
            // I am not sure this case is valid vuejs
            propDescriptor.type = { name: 'array' };
          }
        }
      });
  } else if (isArrayExpression(propsObject.node)) {
    propsObject
      .get('elements')
      .filter((e: NodePath) => isLiteral(e.node))
      .forEach((e) => {
        const nodeLiteral = e.node as StringLiteral;
        const propDescriptor = documentation.getPropDescriptor(nodeLiteral.value);
        propDescriptor.type = { name: 'undefined' };
      });
  }
}

function describeType(
  propPropertiesPath: NodePath<ObjectProperty>,
  propDescriptor: PropDescriptor,
) {
  const typeArray = propPropertiesPath.filter(
    (p: NodePath<ObjectProperty>) => p.node.key.name === 'type',
  );
  if (typeArray.length) {
    propDescriptor.type = getTypeFromTypePath(typeArray[0].get('value'));
  } else {
    // deduce the type from default expression
    const defaultArray = propPropertiesPath.filter(
      (p: NodePath<ObjectProperty>) => p.node.key.name === 'default',
    );
    if (defaultArray.length) {
      const typeNode = defaultArray[0].node as ObjectProperty;
      const func = isArrowFunctionExpression(typeNode.value) || isFunctionExpression(typeNode.value);
      const typeValueNode = defaultArray[0].get('value').node as ValueLitteral;
      const typeName = typeof typeValueNode.value;
      propDescriptor.type = { name: func ? 'func' : typeName };
    }
  }
}

function getTypeFromTypePath(typePath: NodePath): { name: string; func?: boolean } {
  const typeNode = typePath.node;
  const typeName = isArrayExpression(typeNode)
    ? typeNode.elements
        .map((t) => (t && isIdentifier(t) ? t.name.toLowerCase() : 'undefined'))
        .join('|')
    : typeNode && isIdentifier(typeNode)
    ? typeNode.name.toLowerCase()
    : 'undefined';
  return {
    name: typeName === 'function' ? 'func' : typeName,
  };
}

function describeRequired(
  propPropertiesPath: NodePath<ObjectProperty>,
  propDescriptor: PropDescriptor,
) {
  const requiredArray = propPropertiesPath.filter(
    (p: NodePath<ObjectProperty>) => p.node.key.name === 'required',
  );
  const requiredNode = requiredArray.length
    ? (requiredArray[0].get('value').node as BooleanLiteral)
    : undefined;
  propDescriptor.required = requiredNode ? requiredNode.value : '';
}

function describeDefault(propPropertiesPath: NodePath, propDescriptor: PropDescriptor) {
  const defaultArray = propPropertiesPath.filter(
    (p: NodePath<ObjectProperty>) => p.node.key.name === 'default',
  );
  if (defaultArray.length) {
    const defaultNode = defaultArray[0].get('value');
    const func =
      isArrowFunctionExpression(defaultNode.node) || isFunctionExpression(defaultNode.node);

    propDescriptor.defaultValue = {
      func,
      value: generate(defaultNode.node, { format: { quotes: 'double' } }),
    };
  }
}
