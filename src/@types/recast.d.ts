declare module 'recast' {
  import { Node } from '@babel/types'

  interface CodedObject {
    code: string
  }

  export function prettyPrint(path: Node, options: { tabWidth: number }): CodedObject
}
