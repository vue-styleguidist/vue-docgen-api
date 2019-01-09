import { visit, NodePath } from 'ast-types';
import resolveExportDeclaration from './resolveExportDeclaration';
import isExportedAssignment from './isExportedAssignment';
import * as bt from '@babel/types';

function ignore(): boolean {
  return false;
}

function isComponentDefinition(path: NodePath): boolean {
  return (
    bt.isObjectExpression(path.node) ||
    (bt.isCallExpression(path.node) &&
      bt.isMemberExpression(path.node.callee) &&
      bt.isIdentifier(path.node.callee.object) &&
      path.node.callee.object.name === 'Vue' &&
      path.node.callee.property.name === 'extend')
  );
}

/**
 * Given an AST, this function tries to find the exported component definitions.
 *
 * If a definition is part of the following statements, it is considered to be
 * exported:
 *
 * modules.exports = Definition;
 * exports.foo = Definition;
 * export default Definition;
 * export var Definition = ...;
 */
export default function resolveExportedComponent(ast: bt.Program): NodePath[] {
  const components: NodePath[] = [];

  function setComponent(definition: NodePath) {
    if (definition && components.indexOf(definition) === -1) {
      if (bt.isObjectExpression(definition.node)) {
        components.push(definition);
      } else {
        components.push(definition.get('arguments', 0));
      }
    }
  }

  // function run for every non "assignment" export declaration
  // in extenso export default or export myvar
  function exportDeclaration(path: NodePath) {
    const definitions = resolveExportDeclaration(path).reduce(
      (acc: NodePath[], definition: NodePath) => {
        if (isComponentDefinition(definition)) {
          acc.push(definition);
        }
        return acc;
      },
      [],
    );

    if (definitions.length === 0) {
      return false;
    }

    definitions.forEach((definition: NodePath) => {
      setComponent(definition);
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

    visitExportDeclaration: exportDeclaration,
    visitExportNamedDeclaration: exportDeclaration,
    visitExportDefaultDeclaration: exportDeclaration,

    visitAssignmentExpression(path) {
      // function run on every assignments (with an =)

      // Ignore anything that is not `exports.X = ...;` or
      // `module.exports = ...;`
      if (!isExportedAssignment(path)) {
        return false;
      }
      // Resolve the value of the right hand side. It should resolve to a call
      // expression, something like React.createClass
      path = path.get('right');
      if (!isComponentDefinition(path)) {
        if (!isComponentDefinition(path)) {
          return false;
        }
      }

      setComponent(path);
      return false;
    },
  });

  return components;
}
