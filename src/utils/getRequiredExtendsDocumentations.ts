import * as path from 'path';
import * as bt from '@babel/types';
import { NodePath } from 'ast-types';
import resolveRequired from './resolveRequired';
import { parse } from '../main';
import { ComponentDoc } from 'src/Documentation';

/**
 *
 * @param {NodePath} astPath
 * @param {Array<NodePath>} componentDefinitions
 * @param {string} originalFilePath
 */
export default function getRequiredExtendsDocumentations(
  astPath: bt.Program,
  componentDefinitions: NodePath[],
  originalFilePath: string,
): ComponentDoc | undefined {
  const extendsVariableName = getExtendsVariableName(componentDefinitions);
  // if there is no extends or extends is a direct require
  if (!extendsVariableName) {
    return undefined;
  }

  // get all require / import statements
  const extendsFilePath = resolveRequired(astPath, [extendsVariableName]);

  const originalDirName = path.dirname(originalFilePath);
  const fullFilePath = require.resolve(extendsFilePath[extendsVariableName], {
    paths: [originalDirName],
  });
  return parse(fullFilePath);
}

function getExtendsVariableName(componentDefinitions: NodePath[]) {
  const extendsVariable = componentDefinitions.reduce((acc: NodePath[], compDef) => {
    const extendsProp = compDef
      .get('properties')
      .filter((p: NodePath<bt.Property>) => p.node.key.name === 'extends');
    if (extendsProp.length) {
      acc.push(extendsProp[0]);
    }
    return acc;
  }, []);

  if (extendsVariable.length) {
    const extendedPath = extendsVariable[0];
    const extendsValue = bt.isProperty(extendedPath.node) ? extendedPath.node.value : undefined;
    return extendsValue && bt.isIdentifier(extendsValue) ? extendsValue.name : undefined;
  }
  return undefined;
}
