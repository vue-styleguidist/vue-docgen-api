import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { ASTElement, ASTExpression } from 'vue-template-compiler'
import buildParser from '../babel-parser'
import { Documentation } from '../Documentation'
import { TemplateParserOptions } from '../parse-template'

// tslint:disable-next-line:no-var-requires
import recast = require('recast')

const allowRE = /^(v-bind|:)/
export default function propTemplateHandler(
  documentation: Documentation,
  templateAst: ASTElement,
  options: TemplateParserOptions,
) {
  if (options.functional) {
    propsInAttributes(templateAst, documentation)
    propsInInterpolation(templateAst, documentation)
  }
}

function propsInAttributes(templateAst: ASTElement, documentation: Documentation) {
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

function propsInInterpolation(templateAst: ASTElement, documentation: Documentation) {
  if (templateAst.children) {
    templateAst.children
      .filter(c => c.type === 2)
      .forEach((expr: ASTExpression) => {
        getPropsFromExpression(expr.expression, documentation)
      })
  }
}

function getPropsFromExpression(expression: string, documentation: Documentation) {
  const ast = buildParser({ plugins: ['typescript'] }).parse(expression)
  recast.visit(ast.program, {
    visitMemberExpression: (path: NodePath<bt.MemberExpression>) => {
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
        const p = documentation.getPropDescriptor(pName)
        p.type = { name: 'string' }
      }
      return false
    },
  })
}
