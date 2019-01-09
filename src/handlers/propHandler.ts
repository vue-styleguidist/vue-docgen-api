import { generate } from 'escodegen';
import { NodePath } from 'ast-types';
import getDocblock from '../utils/getDocblock';
import getDoclets, { DocBlockTags } from '../utils/getDoclets';
import transformTagsIntoObject from '../utils/transformTagsIntoObject';
import * as bt from '@babel/types';
import { Documentation, PropDescriptor } from 'src/Documentation';
import { BlockTag } from 'src/utils/blockTags';

type ValueLitteral = bt.StringLiteral | bt.BooleanLiteral | bt.NumericLiteral;

export default function propHandler(documentation: Documentation, path: NodePath) {
  const propsPath = path
    .get('properties')
    .filter((p) => bt.isProperty(p.node) && p.node.key.name === 'props');

  // if no prop return
  if (!propsPath.length) {
    return;
  }

  const propsObject = propsPath[0].get('value');

  if (bt.isObjectExpression(propsObject.node)) {
    propsObject
      .get('properties')
      // filter non object properties
      .filter((p: NodePath) => bt.isProperty(p.node))
      .forEach((prop: NodePath<bt.Property>) => {
        const propNode = prop.node;

        // description
        const docBlock = getDocblock(prop);
        const jsDoc: DocBlockTags = docBlock ? getDoclets(docBlock) : { description: '', tags: [] };
        const jsDocTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : [];

        // if it's the v-model describe it only as such
        const propName = jsDocTags.some((t) => t.title === 'model') ? 'v-model' : propNode.key.name;

        const propDescriptor = documentation.getPropDescriptor(propName);
        const propValuePath = prop.get('value');
        const objectExpression = bt.isObjectExpression(propValuePath.node);
        const identifier = bt.isIdentifier(propValuePath.node);
        const tupple = bt.isArrayExpression(propValuePath.node);
        if (identifier || objectExpression || tupple) {
          propDescriptor.tags = jsDocTags.length ? transformTagsIntoObject(jsDocTags) : {};
          if (jsDoc.description) {
            propDescriptor.description = jsDoc.description;
          }

          if (objectExpression) {
            const propPropertiesPath = propValuePath.get('properties') as NodePath<
              bt.ObjectProperty
            >;
            // type
            describeType(propPropertiesPath, propDescriptor);

            // required
            describeRequired(propPropertiesPath, propDescriptor);

            // default
            describeDefault(propPropertiesPath, propDescriptor);
          } else if (identifier) {
            // contents of the prop is it's type
            propDescriptor.type = getTypeFromTypePath(propValuePath);
          } else if (tupple) {
            // I am not sure this case is valid vuejs
            propDescriptor.type = { name: 'array' };
          }
        }
      });
  } else if (bt.isArrayExpression(propsObject.node)) {
    propsObject
      .get('elements')
      .filter((e: NodePath) => bt.isLiteral(e.node))
      .forEach((e: NodePath<bt.StringLiteral>) => {
        const propDescriptor = documentation.getPropDescriptor(e.node.value);
        propDescriptor.type = { name: 'undefined' };
      });
  }
}

function describeType(
  propPropertiesPath: NodePath<bt.ObjectProperty>,
  propDescriptor: PropDescriptor,
) {
  const typeArray = propPropertiesPath.filter(
    (p: NodePath<bt.ObjectProperty>) => p.node.key.name === 'type',
  );
  if (typeArray.length) {
    propDescriptor.type = getTypeFromTypePath(typeArray[0].get('value'));
  } else {
    // deduce the type from default expression
    const defaultArray = propPropertiesPath.filter(
      (p: NodePath<bt.ObjectProperty>) => p.node.key.name === 'default',
    );
    if (defaultArray.length) {
      const typeNode = defaultArray[0].node as bt.ObjectProperty;
      const func =
        bt.isArrowFunctionExpression(typeNode.value) || bt.isFunctionExpression(typeNode.value);
      const typeValueNode = defaultArray[0].get('value').node as ValueLitteral;
      const typeName = typeof typeValueNode.value;
      propDescriptor.type = { name: func ? 'func' : typeName };
    }
  }
}

function getTypeFromTypePath(typePath: NodePath): { name: string; func?: boolean } {
  const typeNode = typePath.node;
  const typeName = bt.isArrayExpression(typeNode)
    ? typeNode.elements
        .map((t) => (t && bt.isIdentifier(t) ? t.name.toLowerCase() : 'undefined'))
        .join('|')
    : typeNode && bt.isIdentifier(typeNode)
    ? typeNode.name.toLowerCase()
    : 'undefined';
  return {
    name: typeName === 'function' ? 'func' : typeName,
  };
}

function describeRequired(
  propPropertiesPath: NodePath<bt.ObjectProperty>,
  propDescriptor: PropDescriptor,
) {
  const requiredArray = propPropertiesPath.filter(
    (p: NodePath<bt.ObjectProperty>) => p.node.key.name === 'required',
  );
  const requiredNode = requiredArray.length ? requiredArray[0].get('value').node : undefined;
  if (requiredNode && bt.isLiteral(requiredNode)) {
    propDescriptor.required = (requiredNode as bt.BooleanLiteral).value;
  }
}

function describeDefault(propPropertiesPath: NodePath, propDescriptor: PropDescriptor) {
  const defaultArray = propPropertiesPath.filter(
    (p: NodePath<bt.ObjectProperty>) => p.node.key.name === 'default',
  );
  if (defaultArray.length) {
    const defaultNode = defaultArray[0].get('value');
    const func =
      bt.isArrowFunctionExpression(defaultNode.node) || bt.isFunctionExpression(defaultNode.node);

    propDescriptor.defaultValue = {
      func,
      value: generate(defaultNode.node, { format: { quotes: 'double' } }),
    };
  }
}
