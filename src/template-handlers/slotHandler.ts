import { ASTElement, ASTNode } from 'vue-template-compiler'
import { Documentation } from '../Documentation'
import { TemplateParserOptions } from '../parse-template'

export default function slotHandler(
  documentation: Documentation,
  templateAst: ASTElement,
  options: TemplateParserOptions,
) {
  if (templateAst.tag === 'slot') {
    const bindings = extractAndFilterAttr(templateAst.attrsMap)
    let name = 'default'
    if (bindings.name) {
      name = bindings.name
      delete bindings.name
    }

    const slotDescriptor = documentation.getSlotDescriptor(name)

    slotDescriptor.bindings = bindings
    let comment = ''
    if (templateAst.parent) {
      const slotSiblings: ASTNode[] = templateAst.parent.children
      // First find the position of the slot in the list
      let i = slotSiblings.length - 1
      let currentSlotIndex = -1
      do {
        if (slotSiblings[i] === templateAst) {
          currentSlotIndex = i
        }
      } while (currentSlotIndex < 0 && i--)

      // Find the first leading comment node as a description of the slot
      const slotSiblingsBeforeSlot = slotSiblings.slice(0, currentSlotIndex).reverse()

      for (const potentialComment of slotSiblingsBeforeSlot) {
        // if there is text between the slot and the comment ignore
        if (
          potentialComment.type !== 3 ||
          (!potentialComment.isComment && potentialComment.text.trim())
        ) {
          break
        }

        if (
          potentialComment.isComment &&
          !(
            templateAst.parent.tag === 'slot' && templateAst.parent.children[0] === potentialComment
          )
        ) {
          comment = potentialComment.text.trim()

          break
        }
      }
    } else if (options.rootLeadingComment.length) {
      comment = options.rootLeadingComment
    }

    if (comment.length && comment.search(/\@slot/) !== -1) {
      slotDescriptor.description = comment.replace('@slot', '').trim()
    }
  }
}

const dirRE = /^(v-|:|@)/
const allowRE = /^(v-bind|:)/

function extractAndFilterAttr(attrsMap: Record<string, any>): Record<string, any> {
  const res: Record<string, any> = {}
  const keys = Object.keys(attrsMap)
  for (const key of keys) {
    if (!dirRE.test(key) || allowRE.test(key)) {
      res[key.replace(allowRE, '')] = attrsMap[key]
    }
  }
  return res
}
