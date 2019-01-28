import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import * as path from 'path'
import { Documentation } from '../Documentation'
import { parseFile } from '../parse'
import resolvePathFrom from '../utils/resolvePathFrom'
import resolveRequired from '../utils/resolveRequired'

/**
 * @returns {object} an object containing the documentations for each mixin
 * key: mixin variable name
 * value: documentation of named mixin
 */
export default function mixinsHandler(
  documentation: Documentation,
  componentDefinition: NodePath,
  astPath: bt.File,
  originalFilePath: string,
) {
  const originalDirName = path.dirname(originalFilePath)
  // filter only mixins
  const mixinVariableNames = getMixinsVariableNames(componentDefinition)

  if (!mixinVariableNames) {
    return
  }

  // get all require / import statements
  const mixinVarToFilePath = resolveRequired(astPath, mixinVariableNames)

  // get each doc for each mixin using parse
  for (const varName of Object.keys(mixinVarToFilePath)) {
    // TODO: consolidate variables accessing the same file
    const { filePath, exportName } = mixinVarToFilePath[varName]
    const fullFilePath = resolvePathFrom(filePath, originalDirName)
    parseFile(fullFilePath, documentation, [exportName])
  }
}

function getMixinsVariableNames(compDef: NodePath): string[] | undefined {
  if (!bt.isObjectExpression(compDef.node)) {
    return undefined
  }
  const mixinProp = compDef
    .get('properties')
    .filter((p: NodePath<bt.Property>) => p.node.key.name === 'mixins')
  const mixinPath = mixinProp.length ? (mixinProp[0] as NodePath<bt.Property>) : undefined

  const varNames: string[] = []
  if (mixinPath) {
    const mixinPropertyValue =
      mixinPath.node.value && bt.isArrayExpression(mixinPath.node.value)
        ? mixinPath.node.value.elements
        : []
    mixinPropertyValue.forEach((e: bt.Node | null) => {
      if (e && bt.isIdentifier(e)) {
        varNames.push(e.name)
      }
    })
  }
  return varNames
}
