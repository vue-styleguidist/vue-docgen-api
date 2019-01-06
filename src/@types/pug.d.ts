interface Token {
  type: string
  line: number
  col: number
  val?: string
  name?: string
  mustEscape?: boolean
}

declare module 'pug-lexer' {
  export class Lexer {
    constructor(content: string, options?: any)
    getTokens(): Token[]
  }
}

declare module 'pug-parser' {
  export class Parser {
    constructor(lexedTokens: Token[])
    parse(): { type: string; nodes: any[]; line: number; filename?: string }
  }
}

declare module 'pug-runtime/wrap' {
  function wrap(funcStr: string, str: string): any
  export = wrap
}
declare module 'pug-code-gen' {
  function generateCode(lexed: any, options: any): string
  export = generateCode
}
