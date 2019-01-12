import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import * as path from 'path'
import { ComponentDoc } from 'src/Documentation'
import { parse } from '../main'
import resolvePathFrom from './resolvePathFrom'
import resolveRequired from './resolveRequired'

/**
 * @returns {object} an object containing the documentations for each mixin
 * key: mixin variable name
 * value: documentation of named mixin
 */
export default function getRequiredMixinDocumentations(
  astPath: bt.Program,
  componentDefinitions: NodePath[],
  originalFilePath: string,
): { [varName: string]: ComponentDoc } {
  const originalDirName = path.dirname(originalFilePath)
  // filter only mixins
  const mixinVariableNames = getMixinsVariableNames(componentDefinitions)

  // get all require / import statements
  const mixinVarToFilePath = resolveRequired(astPath, mixinVariableNames)

  const mixinVarToDoc: { [variableName: string]: ComponentDoc } = {}
  const mixinFileToDoc: { [filePath: string]: ComponentDoc } = {}

  // get each doc for each mixin using parse
  for (const varName of Object.keys(mixinVarToFilePath)) {
    const filePath = mixinVarToFilePath[varName]
    let doc = mixinFileToDoc[filePath]
    if (!doc) {
      const fullFilePath = resolvePathFrom(filePath, originalDirName)
      doc = parse(fullFilePath)
      mixinFileToDoc[filePath] = doc
    }
    mixinVarToDoc[varName] = doc
  }

  return mixinVarToDoc
}

function getMixinsVariableNames(componentDefinitions: NodePath[]) {
  const allMixins = componentDefinitions
    .filter((comp) => bt.isObjectExpression(comp.node))
    .map((compDef) => {
      const mixinProp = compDef
        .get('properties')
        .filter((p: NodePath<bt.Property>) => p.node.key.name === 'mixins')
      return mixinProp.length ? mixinProp[0] : undefined
    })
  return allMixins.reduce((acc: string[], mixinPath: NodePath<bt.Property>) => {
    if (mixinPath) {
      const mixinPropertyValue =
        mixinPath.node.value && bt.isArrayExpression(mixinPath.node.value)
          ? mixinPath.node.value.elements
          : []
      mixinPropertyValue.forEach((e) => {
        if (e && bt.isIdentifier(e)) {
          acc.push(e.name)
        }
      })
    }
    return acc
  }, [])
}
