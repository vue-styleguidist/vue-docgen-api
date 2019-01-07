import { visit, NodePath } from 'ast-types';
import {
  isImportDefaultSpecifier,
  isImportSpecifier,
  isLiteral,
  StringLiteral,
  Program,
} from '@babel/types';

function ignore() {
  return false;
}

export default function resolveRequired(ast: Program, varNameFilter: string[]) {
  const varToFilePath: { [key: string]: string } = {};

  function importDeclaration(astPath: NodePath) {
    const specifiers = astPath.get('specifiers');

    // if `import 'module'` without variable name it cannot be a mixin
    if (!specifiers.node) {
      return false;
    }

    specifiers.each((sp: NodePath) => {
      const nodeSpecifier = sp.node;
      if (isImportDefaultSpecifier(nodeSpecifier) || isImportSpecifier(nodeSpecifier)) {
        const varNameDefault = nodeSpecifier.local.name;
        if (varNameFilter.indexOf(varNameDefault) > -1) {
          const nodeSource = astPath.get('source').node;
          if (isLiteral(nodeSource)) {
            varToFilePath[varNameDefault] = (nodeSource as StringLiteral).value;
          }
        }
      }
    });
    return false;
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
  });

  return varToFilePath;
}
