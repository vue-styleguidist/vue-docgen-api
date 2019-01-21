declare module 'recast' {
  import * as bt from '@babel/types'
  import { NodePath } from 'ast-types'

  const recast: {
    visit(path: NodePath | bt.Program, visitors: { [key: string]: (path: NodePath) => any }): void
    parse(source: string, options?: { parser?: { parse(src: string): bt.File } }): bt.File
    print(path: NodePath): { code: string }
  }

  export = recast
}
