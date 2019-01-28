import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import * as path from 'path'
import { Documentation } from '../Documentation'
import { parseFile, ParseOptions } from '../parse'
import resolveAliases from '../utils/resolveAliases'
import resolvePathFrom from '../utils/resolvePathFrom'
import resolveRequired from '../utils/resolveRequired'

/**
 * Retruns documentation of the component referenced in the extends property of the component
 * @param {NodePath} astPath
 * @param {Array<NodePath>} componentDefinitions
 * @param {string} originalFilePath
 */
export default function extendsHandler(
  documentation: Documentation,
  componentDefinition: NodePath,
  astPath: bt.File,
  opt: ParseOptions,
) {
  const extendsVariableName = getExtendsVariableName(componentDefinition)

  // if there is no extends or extends is a direct require
  if (!extendsVariableName) {
    return
  }

  // get all require / import statements
  const extendsFilePath = resolveRequired(astPath, [extendsVariableName])

  const originalDirName = path.dirname(opt.filePath)

  // only look for documentation in the current project not in node_modules
  if (/^\./.test(extendsFilePath[extendsVariableName].filePath)) {
    const fullFilePath = resolveAliases(
      resolvePathFrom(extendsFilePath[extendsVariableName].filePath, originalDirName),
      opt.aliases || {},
    )

    parseFile(documentation, {
      ...opt,
      filePath: fullFilePath,
      nameFilter: [extendsFilePath[extendsVariableName].exportName],
    })
  }
}

function getExtendsVariableName(compDef: NodePath): string | undefined {
  const extendsVariable: NodePath | undefined =
    compDef &&
    bt.isClassDeclaration(compDef.node) &&
    compDef.node.superClass &&
    bt.isIdentifier(compDef.node.superClass)
      ? (compDef.get('superClass') as NodePath<bt.Identifier>)
      : getExtendsVariableNameFromCompDef(compDef)

  if (extendsVariable) {
    const extendsValue = bt.isProperty(extendsVariable.node)
      ? extendsVariable.node.value
      : extendsVariable.node
    return extendsValue && bt.isIdentifier(extendsValue) ? extendsValue.name : undefined
  }
  return undefined
}

function getExtendsVariableNameFromCompDef(compDef: NodePath): NodePath | undefined {
  if (!compDef) {
    return undefined
  }
  const pathExtends = compDef
    .get('properties')
    .filter((p: NodePath<bt.Property>) => p.node.key.name === 'extends')
  return pathExtends.length ? pathExtends[0] : undefined
}
