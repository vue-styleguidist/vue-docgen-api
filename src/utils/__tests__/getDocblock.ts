import { visit, NodePath } from 'ast-types';
import babylon from '../../babel-parser';
import getDocblock from '../getDocblock';
import { File } from '@babel/types';

describe('getDocblock', () => {
  it('should resolve imported variables', () => {
    const ast = babylon().parse(
      [
        '',
        '/**',
        ' * tested comment',
        ' * tested description',
        ' */',
        'var testedVariable = 8;',
        '',
      ].join('\n'),
    );
    const varPath = getFirstVariablePath(ast);

    const docblock = getDocblock(varPath);
    expect(docblock).toEqual(['tested comment', 'tested description'].join('\n'));
  });
});

function getFirstVariablePath(ast: File): NodePath {
  const varPath: NodePath[] = [];
  visit(ast.program, {
    visitVariableDeclaration: (a: NodePath) => {
      varPath.push(a);
      return false;
    },
  });
  return varPath[0];
}