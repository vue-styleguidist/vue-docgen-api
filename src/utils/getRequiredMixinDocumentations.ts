import path from 'path';
import { NodePath } from 'ast-types';
import resolveRequired from './resolveRequired';
import { Program, Property, isIdentifier, isProperty, isArrayExpression } from '@babel/types';
import { Documentation, ComponentDoc } from 'src/Documentation';
import { parse } from '../main';

/**
 * @returns {object} an object containing the documentations for each mixin
 * key: mixin variable name
 * value: documentation of named mixin
 */
export default function getRequiredMixinDocumentations(
  astPath: Program,
  componentDefinitions: NodePath[],
  originalFilePath: string,
): { [varName: string]: ComponentDoc } {
  const originalDirName = path.dirname(originalFilePath);
  // filter only mixins
  const mixinVariableNames = getMixinsVariableNames(componentDefinitions);

  // get all require / import statements
  const mixinVarToFilePath = resolveRequired(astPath, mixinVariableNames);

  const mixinVarToDoc: { [variableName: string]: ComponentDoc } = {};
  const mixinFileToDoc: { [filePath: string]: ComponentDoc } = {};

  // get each doc for each mixin using parse
  for (const varName of Object.keys(mixinVarToFilePath)) {
    const filePath = mixinVarToFilePath[varName];
    let doc = mixinFileToDoc[filePath];
    if (!doc) {
      const fullFilePath = require.resolve(filePath, { paths: [originalDirName] });
      doc = parse(fullFilePath);
      mixinFileToDoc[filePath] = doc;
    }
    mixinVarToDoc[varName] = doc;
  }

  return mixinVarToDoc;
}

function getMixinsVariableNames(componentDefinitions: NodePath[]) {
  const allMixins = componentDefinitions.map((compDef) => {
    const mixinProp = compDef
      .get('properties')
      .filter((p: NodePath<Property>) => p.node.key.name === 'mixins');
    return mixinProp.length ? mixinProp[0] : undefined;
  });
  return allMixins.reduce((acc: string[], mixinPath: NodePath<Property>) => {
    if (mixinPath) {
      const mixinPropertyValue =
        mixinPath.node.value && isArrayExpression(mixinPath.node.value)
          ? mixinPath.node.value.elements
          : [];
      mixinPropertyValue.forEach((e) => {
        if (e && isIdentifier(e)) {
          acc.push(e.name);
        }
      });
    }
    return acc;
  }, []);
}
