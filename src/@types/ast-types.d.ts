declare module 'ast-types' {
  interface AstNodeType {
    check: (testedNode: Node) => boolean
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
}
