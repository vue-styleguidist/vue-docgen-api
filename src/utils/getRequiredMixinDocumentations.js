import path from 'path'
import { parse } from '../main'

// TODO: split this into multiple unit testable files

/**
 * @returns {object} an object containing the documentations for each mixin
 * key: mixin variable name
 * value: documentation of named mixin
 */
export default function getRequiredMixinDocumentations(
  astPath,
  recast,
  componentDefinitions,
  originalFilePath
) {
  const types = recast.types.namedTypes

  const originalDirName = path.dirname(originalFilePath)
  // filter only mixins
  const mixinVariableNames = getMixinsVariableNames(componentDefinitions, types)

  // get all require / import statements
  const mixinVarToFilePath = resolveRequired(astPath, recast, mixinVariableNames, types)

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

function getMixinsVariableNames(componentDefinitions, types) {
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

function ignore() {
  return false
}

function resolveRequired(ast, recast, varNameFilter, types) {
  const mixinVarToFilePath = {}

  function importDeclaration(astPath) {
    const specifiers = astPath.get('specifiers').value

    // if `import 'module'` without variable name it cannot be a mixin
    if (!specifiers || !specifiers.length) return false

    specifiers.forEach(sp => {
      if (types.ImportDefaultSpecifier.check(sp) || types.ImportSpecifier.check(sp)) {
        const varNameDefault = sp.local.name
        if (varNameFilter.indexOf(varNameDefault) > -1) {
          mixinVarToFilePath[varNameDefault] = astPath.get('source').node.value
        }
      }
    })
    return false
  }

  recast.visit(ast, {
    visitFunctionDeclaration: ignore,
    visitFunctionExpression: ignore,
    visitClassDeclaration: ignore,
    visitClassExpression: ignore,
    visitIfStatement: ignore,
    visitWithStatement: ignore,
    visitSwitchStatement: ignore,
    visitCatchCause: ignore,
    visitWhileStatement: ignore,
    visitDoWhileStatement: ignore,
    visitForStatement: ignore,
    visitForInStatement: ignore,

    visitImportDeclaration: importDeclaration,

    // TODO: add the dealings of es5 require instead of import
    visitVariableDeclaration: ignore,
  })

  return mixinVarToFilePath
}
