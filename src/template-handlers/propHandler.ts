import * as bt from '@babel/types'
import { NodePath } from 'recast'
import { ASTElement, ASTExpression } from 'vue-template-compiler'
import buildParser from '../babel-parser'
import { ComponentDoc } from '../Documentation'
import { TemplateParserOptions } from '../parse-template'

const recast = require('recast')

const allowRE = /^(v-bind|:)/
export default function propTemplateHandler(
  templateAst: ASTElement,
  documentation: ComponentDoc,
  options: TemplateParserOptions,
) {
  if (options.functional) {
    propsInAttributes(templateAst, documentation)
    propsInInterpolation(templateAst, documentation)
  }
}

function propsInAttributes(templateAst: ASTElement, documentation: ComponentDoc) {
  const bindings = templateAst.attrsMap
  const keys = Object.keys(bindings)
  for (const key of keys) {
    // only look at expressions
    if (allowRE.test(key)) {
      const expression = bindings[key]
      getPropsFromExpression(expression, documentation)
    }
  }
}

function propsInInterpolation(templateAst: ASTElement, documentation: ComponentDoc) {
  if (templateAst.children) {
    templateAst.children
      .filter((c) => c.type === 2)
      .forEach((expr: ASTExpression) => {
        getPropsFromExpression(expr.expression, documentation)
      })
  }
}

function getPropsFromExpression(expression: string, documentation: ComponentDoc) {
  const ast = buildParser({ plugins: ['typescript'] }).parse(expression)
  recast.visit(ast, {
    visitMemberExpression: (path: NodePath) => {
      const obj = path.node ? path.node.object : undefined
      const propName = path.node ? path.node.property : undefined
      if (
        obj &&
        propName &&
        bt.isIdentifier(obj) &&
        obj.name === 'props' &&
        bt.isIdentifier(propName)
      ) {
        const pName = propName.name
        documentation.props = documentation.props || {}
        documentation.props[pName] = documentation.props[pName] || { type: { name: 'string' } }
      }
      return false
    },
  })
}
