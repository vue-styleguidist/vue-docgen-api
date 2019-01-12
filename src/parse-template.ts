import * as pug from 'pug'
import { ASTElement, ASTNode, compile, SFCBlock } from 'vue-template-compiler'
import { ComponentDoc } from './Documentation'

export interface TemplateParserOptions {
  functional: boolean
}

export type Handler = (
  templateAst: ASTElement,
  documentation: ComponentDoc,
  options: TemplateParserOptions,
) => void

export default function parseTemplate(
  tpl: SFCBlock,
  documentation: ComponentDoc,
  handlers: Handler[],
  filePath: string,
) {
  if (tpl && tpl.content) {
    const template =
      tpl.attrs && tpl.attrs.lang === 'pug'
        ? pug.render(tpl.content, { filename: filePath })
        : tpl.content
    const ast = compile(template, { comments: true }).ast
    if (ast) {
      traverse(ast, documentation, handlers, { functional: !!tpl.attrs.functional })
    }
  }
  return {}
}

export function traverse(
  templateAst: ASTElement,
  documentation: ComponentDoc,
  handlers: Handler[],
  options: TemplateParserOptions,
) {
  if (templateAst.type === 1) {
    handlers.forEach((handler) => {
      handler(templateAst, documentation, options)
    })
    if (templateAst.children) {
      for (const childNode of templateAst.children) {
        if (isASTElement(childNode)) {
          traverse(childNode, documentation, handlers, options)
        }
      }
    }
  }
}

function isASTElement(node: ASTNode): node is ASTElement {
  return !!node && (node as ASTElement).children !== undefined
}
