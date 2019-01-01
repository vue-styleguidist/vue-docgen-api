import { namedTypes as types, visit } from 'ast-types'

function ignore() {
  return false
}

export default function resolveRequired(ast, varNameFilter) {
  const varToFilePath = {}

  function importDeclaration(astPath) {
    const specifiers = astPath.get('specifiers').value

    // if `import 'module'` without variable name it cannot be a mixin
    if (!specifiers || !specifiers.length) return false

    specifiers.forEach(sp => {
      if (types.ImportDefaultSpecifier.check(sp) || types.ImportSpecifier.check(sp)) {
        const varNameDefault = sp.local.name
        if (varNameFilter.indexOf(varNameDefault) > -1) {
          varToFilePath[varNameDefault] = astPath.get('source').node.value
        }
      }
    })
    return false
  }

  visit(ast, {
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

  return varToFilePath
}
