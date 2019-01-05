declare module 'vue-template-compiler' {
  import { CompiledSFC } from 'vue-sfc'

  export function parseComponent(ssource: string, options: { pad: boolean }): CompiledSFC
}
