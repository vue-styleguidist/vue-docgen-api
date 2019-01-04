declare module 'ast-types' {
  import { Node } from '@babel/types'
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

  export interface NodePath {
    node: Node
    parent?: NodePath
    parentPath?: NodePath
    get(...name: (string | number)[]): NodePath
    each(callback: (path: NodePath) => any, context?: any): void
  }

  export function visit(path: NodePath, visitors: { [key: string]: (path: NodePath) => any }): void
}
