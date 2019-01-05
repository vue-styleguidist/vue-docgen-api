declare module 'vue-sfc' {
  interface Template {
    content: string
    lang?: string
  }

  export interface CompiledSFC {
    script: Template
    template: Template
    styles: Template
    customBlock: Template[]
  }
}
