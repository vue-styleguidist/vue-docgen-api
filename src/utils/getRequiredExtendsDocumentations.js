import { namedTypes as types } from 'ast-types'
import path from 'path'
import resolveRequired from './resolveRequired'
import { parse } from '../main'

/**
 *
 * @param {NodePath} astPath
 * @param {Array<NodePath>} componentDefinitions
 * @param {string} originalFilePath
 */
export default function getRequiredExtendsDocumentations(
  astPath,
  componentDefinitions,
  originalFilePath
) {
  const extendsVariableName = getExtendsVariableName(componentDefinitions)
  // if there is no extends or extends is a direct require
  if (!extendsVariableName) {
    return undefined
  }

  // get all require / import statements
  const extendsFilePath = resolveRequired(astPath, [extendsVariableName], types)

  const originalDirName = path.dirname(originalFilePath)
  const fullFilePath = require.resolve(extendsFilePath[extendsVariableName], {
    paths: [originalDirName],
  })
  return parse(fullFilePath)
}

function getExtendsVariableName(componentDefinitions) {
  const extendsVariable = componentDefinitions.reduce((acc, compDef) => {
    const extendsProp = compDef.get('properties').filter(p => p.node.key.name === 'extends')
    if (extendsProp.length) {
      acc.push(extendsProp[0])
    }
    return acc
  }, [])

  if (extendsVariable.length) {
    const extendsValue = extendsVariable[0].node.value
    return types.Identifier.check(extendsValue) ? extendsValue.name : undefined
  }
  return undefined
}
