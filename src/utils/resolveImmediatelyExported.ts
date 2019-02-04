import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { ImportedVariableSet } from './resolveRequired'

// tslint:disable-next-line:no-var-requires
import recast = require('recast')

export default function(ast: bt.File, variableFilter: string[]): ImportedVariableSet {
  const variables: ImportedVariableSet = {}

  const importedVariablePaths: ImportedVariableSet = {}

  // get imported variable names and filepath
  recast.visit(ast.program, {
    visitImportDeclaration(astPath: NodePath<bt.ImportDeclaration>) {
      if (!astPath.node.source) {
        return false
      }
      const filePath = astPath.node.source.value

      const specifiers = astPath.get('specifiers')
      specifiers.each((s: NodePath<bt.ImportSpecifier | bt.ImportDefaultSpecifier>) => {
        const varName = s.node.local.name
        const exportName = bt.isImportSpecifier(s.node) ? s.node.imported.name : 'default'
        importedVariablePaths[varName] = { filePath, exportName }
      })
      return false
    },
  })

  recast.visit(ast.program, {
    visitExportNamedDeclaration(astPath: NodePath<bt.ExportNamedDeclaration>) {
      const specifiers = astPath.get('specifiers')
      if (astPath.node.source) {
        const filePath = astPath.node.source.value

        specifiers.each((s: NodePath<bt.ExportSpecifier>) => {
          const varName = s.node.exported.name
          const exportName = s.node.local.name
          if (variableFilter.indexOf(varName) > -1) {
            variables[varName] = { filePath, exportName }
          }
        })
      } else {
        specifiers.each((s: NodePath<bt.ExportSpecifier>) => {
          const varName = s.node.exported.name
          const middleName = s.node.local.name
          const importedVar = importedVariablePaths[middleName]
          if (importedVar && variableFilter.indexOf(varName) > -1) {
            variables[varName] = importedVar
          }
        })
      }

      return false
    },
    visitExportDefaultDeclaration(astPath: NodePath<bt.ExportDefaultDeclaration>) {
      if (variableFilter.indexOf('default') > -1) {
        const middleNameDeclaration = astPath.node.declaration
        if (bt.isIdentifier(middleNameDeclaration)) {
          const middleName = middleNameDeclaration.name
          const importedVar = importedVariablePaths[middleName]
          if (importedVar) {
            variables.default = importedVar
          }
        }
      }
      return false
    },
  })

  return variables
}
