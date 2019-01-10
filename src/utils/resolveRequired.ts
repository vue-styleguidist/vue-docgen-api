import * as bt from '@babel/types';
import { NodePath, visit } from 'ast-types';

function ignore() {
  return false;
}

/**
 *
 * @param ast
 * @param varNameFilter
 */
export default function resolveRequired(
  ast: bt.Program,
  varNameFilter?: string[],
): { [key: string]: string } {
  const varToFilePath: { [key: string]: string } = {};

  function importDeclaration(astPath: NodePath) {
    const specifiers = astPath.get('specifiers');

    // if `import 'module'` without variable name it cannot be a mixin
    if (!specifiers.node) {
      return false;
    }

    specifiers.each((sp: NodePath) => {
      const nodeSpecifier = sp.node;
      if (bt.isImportDefaultSpecifier(nodeSpecifier) || bt.isImportSpecifier(nodeSpecifier)) {
        const varNameDefault = nodeSpecifier.local.name;
        if (!varNameFilter || varNameFilter.indexOf(varNameDefault) > -1) {
          const nodeSource = astPath.get('source').node;
          if (bt.isLiteral(nodeSource)) {
            varToFilePath[varNameDefault] = (nodeSource as bt.StringLiteral).value;
          }
        }
      }
    });
    return false;
  }

  function requireDeclaration(astPath: NodePath) {
    // only look at variable declarations
    if (!bt.isVariableDeclaration(astPath.node)) {
      return false;
    }
    astPath.node.declarations.forEach((nodeDeclaration) => {
      let sourceNode: bt.Node;
      let source: string = '';
      const init =
        nodeDeclaration.init && bt.isMemberExpression(nodeDeclaration.init)
          ? nodeDeclaration.init.object
          : nodeDeclaration.init;
      if (!init) {
        return false;
      }

      if (bt.isCallExpression(init)) {
        if (!bt.isIdentifier(init.callee) || init.callee.name !== 'require') {
          return false;
        }
        sourceNode = init.arguments[0];
        if (!bt.isLiteral(sourceNode)) {
          return false;
        }
        source = (sourceNode as bt.StringLiteral).value;
      } else {
        return false;
      }

      if (bt.isIdentifier(nodeDeclaration.id)) {
        const varName = nodeDeclaration.id.name;
        varToFilePath[varName] = source;
      } else if (bt.isObjectPattern(nodeDeclaration.id)) {
        nodeDeclaration.id.properties.forEach((p: bt.ObjectProperty) => {
          varToFilePath[p.key.name] = source;
        });
      } else {
        return false;
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

    visitVariableDeclaration: requireDeclaration,
  });

  return varToFilePath;
}
