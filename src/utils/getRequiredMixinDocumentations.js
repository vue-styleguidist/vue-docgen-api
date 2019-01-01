import path from 'path'
import { namedTypes as types } from 'ast-types'
import resolveRequired from './resolveRequired'
import { parse } from '../main'

/**
 * @returns {object} an object containing the documentations for each mixin
 * key: mixin variable name
 * value: documentation of named mixin
 */
export default function getRequiredMixinDocumentations(
  astPath,
  componentDefinitions,
  originalFilePath
) {
  const originalDirName = path.dirname(originalFilePath)
  // filter only mixins
  const mixinVariableNames = getMixinsVariableNames(componentDefinitions)

  // get all require / import statements
  const mixinVarToFilePath = resolveRequired(astPath, mixinVariableNames)

  const mixinVarToDoc = {}
  const mixinFileToDoc = {}

  // get each doc for each mixin using parse
  for (let varName of Object.keys(mixinVarToFilePath)) {
    const filePath = mixinVarToFilePath[varName]
    let doc = mixinFileToDoc[filePath]
    if (!doc) {
      const fullFilePath = require.resolve(filePath, { paths: [originalDirName] })
      doc = parse(fullFilePath)
      mixinFileToDoc[filePath] = doc
    }
    mixinVarToDoc[varName] = doc
  }

  return mixinVarToDoc
}

function getMixinsVariableNames(componentDefinitions) {
  const allMixins = componentDefinitions.map(compDef => {
    const mixinProp = compDef.get('properties').filter(p => p.node.key.name === 'mixins')
    return mixinProp.length ? mixinProp[0] : undefined
  })
  return allMixins.reduce((acc, i) => {
    if (i) {
      const mixinPropertyValue = i.node.value.elements
      mixinPropertyValue.forEach(e => {
        if (types.Identifier.check(e)) {
          acc.push(e.name)
        }
      })
    }
    return acc
  }, [])
}
