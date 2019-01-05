declare module 'vue-sfc' {
  export interface Template {
    content: string
    attrs?: {
      lang?: string
    }
  }

  export interface CompiledSFC {
    script: Template
    template: Template
    styles: Template
    customBlock: Template[]
  }
}
