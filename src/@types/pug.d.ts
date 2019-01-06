declare module 'pug-lexer' {
  export class Lexer {
    tokens: any[]
    constructor(content: string, options?: any)
  }
}

declare module 'pug-parser' {
  export class Parser {
    constructor(lexed: any)
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
