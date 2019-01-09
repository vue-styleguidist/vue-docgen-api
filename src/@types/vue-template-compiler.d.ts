declare module 'vue-template-compiler' {
  export interface Template {
    content: string
    attrs?: {
      lang?: string
    }
  }

  export interface CompiledSFC {
    script?: Template
    template?: Template
    styles?: Template
    customBlock?: Template[]
  }

  export function parseComponent(ssource: string, options: { pad: boolean }): CompiledSFC
}
