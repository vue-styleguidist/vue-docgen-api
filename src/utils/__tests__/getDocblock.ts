import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import babylon from '../../babel-parser'
import getDocblock from '../getDocblock'

// tslint:disable-next-line:no-var-requires
import recast = require('recast')

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
      ].join('\n')
    )
    const varPath = getFirstVariablePath(ast)

    const docblock = getDocblock(varPath)
    expect(docblock).toEqual(['tested comment', 'tested description'].join('\n'))
  })
})

function getFirstVariablePath(ast: bt.File): NodePath {
  const varPath: NodePath[] = []
  recast.visit(ast.program, {
    visitVariableDeclaration: (a: NodePath) => {
      varPath.push(a)
      return false
    },
  })
  return varPath[0]
}
