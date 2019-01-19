declare module 'ast-types' {
  import * as bt from '@babel/types'

  export interface NodePath<T extends bt.Node = bt.Node> {
    node: T
    parent: NodePath
    parentPath: NodePath
    get(...name: (string | number)[]): NodePath
    // array properies
    length: number
    each(callback: (path: NodePath) => any, context?: any): void
    filter(predicate: (path: NodePath) => boolean): NodePath[]
  }
}
