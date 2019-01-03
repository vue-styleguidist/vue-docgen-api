import htmlparser2 from 'htmlparser2'

import { Lexer as lex } from 'pug-lexer'
import { Parser as parse } from 'pug-parser'
import wrap from 'pug-runtime/wrap'
import generateCode from 'pug-code-gen'

const HtmlParser = htmlparser2.Parser

export default function getSlots(parts) {
  const output = {}
  if (parts.template && parts.template.content) {
    let template = parts.template.content
    let lastComment = ''

    if (parts.template.attrs.lang === 'pug') {
      const funcStr = generateCode(parse(lex(parts.template.content)), {
        compileDebug: false,
        pretty: true,
        inlineRuntimeFunctions: false,
        templateName: '_parse',
      })
      const func = wrap(funcStr, '_parse')
      template = func()
    }

    const parser = new HtmlParser({
      oncomment: data => {
        if (data.search(/\@slot/) !== -1) {
          lastComment = data.replace('@slot', '').trim()
        }
      },
      ontext: text => {
        if (text.trim()) {
          lastComment = ''
        }
      },
      onopentag: (name, attrs) => {
        if (name === 'slot') {
          const nameSlot = attrs.name || 'default'
          output[nameSlot] = {
            description: lastComment,
          }

          lastComment = ''
        }
      },
    })

    parser.write(template)
    parser.end()
    return output
  }
  return {}
}
