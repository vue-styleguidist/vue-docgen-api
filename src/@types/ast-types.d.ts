declare module 'ast-types' {
  import { Node, Program } from '@babel/types'
  interface AstNodeType {
    check: (testedNode: Node | null) => boolean
  }

  export const namedTypes: {
    CommentBlock: AstNodeType
    Literal: AstNodeType
    Identifier: AstNodeType
    Property: AstNodeType
    ExpressionStatement: AstNodeType
    AssignmentExpression: AstNodeType
    MemberExpression: AstNodeType
    VariableDeclaration: AstNodeType
    ObjectExpression: AstNodeType
    CallExpression: AstNodeType
    ImportDefaultSpecifier: AstNodeType
  }

  export interface NodePath<T extends Node = Node> {
    node: T
    parent: NodePath
    parentPath?: Node
    get(...name: (string | number)[]): NodePath
    // array properies
    length: number
    each(callback: (path: NodePath) => any, context?: any): void
    filter(predicate: (path: NodePath) => boolean): NodePath[]
  }

  export function visit(
    path: NodePath | Program,
    visitors: { [key: string]: (path: NodePath) => any }
  ): void
}
