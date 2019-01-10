import { SFCBlock, ASTElement, ASTNode, compile } from 'vue-template-compiler';
import getHtmlFromPug from './utils/getHtmlFromPug';
import { ComponentDoc } from './Documentation';

export default function parseTemplate(
  tpl: SFCBlock,
  documentation: ComponentDoc,
  handlers: Array<(templateAst: ASTElement, documentation: ComponentDoc) => void>,
) {
  if (tpl && tpl.content) {
    const template =
      tpl.attrs && tpl.attrs.lang === 'pug' ? getHtmlFromPug(tpl.content) : tpl.content;
    const ast = compile(template, { comments: true }).ast;
    if (ast) {
      traverse(ast, documentation, handlers);
    }
  }
  return {};
}

function traverse(
  templateAst: ASTElement,
  documentation: ComponentDoc,
  handlers: Array<(templateAst: ASTElement, documentation: ComponentDoc) => void>,
) {
  if (templateAst.type === 1) {
    handlers.forEach((handler) => {
      handler(templateAst, documentation);
    });
    if (templateAst.children) {
      for (const childNode of templateAst.children) {
        if (isASTElement(childNode)) {
          traverse(childNode, documentation, handlers);
        }
      }
    }
  }
}

function isASTElement(node: ASTNode): node is ASTElement {
  return !!node && (node as ASTElement).children !== undefined;
}
