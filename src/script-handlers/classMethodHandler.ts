import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { BlockTag } from 'src/utils/blockTags'
import { Documentation, MethodDescriptor } from '../Documentation'
import getDocblock from '../utils/getDocblock'
import getDoclets, { DocBlockTags } from '../utils/getDoclets'

export default function methodHandler(documentation: Documentation, path: NodePath) {
  if (bt.isClassDeclaration(path.node)) {
    const methods: MethodDescriptor[] = documentation.get('methods') || []
    const allMethods = path
      .get('body', 'body')
      .filter((a: NodePath) => (a.node as any).type === 'MethodDefinition')

    allMethods.forEach((methodPath: NodePath<bt.Method>) => {
      const docBlock = getDocblock(methodPath)
      const jsDoc: DocBlockTags = docBlock ? getDoclets(docBlock) : { description: '', tags: [] }
      const jsDocTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : []
      if (!jsDocTags.some((t) => t.title === 'public')) {
        return
      }
      const name = methodPath.node.key.name
      methods.push({
        name,
        description: jsDoc.description,
      })
    })
    documentation.set('methods', methods)
  }
}
