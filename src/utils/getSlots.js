import htmlparser2 from 'htmlparser2'

const HtmlParser = htmlparser2.Parser
const lex = require('pug-lexer');
const parse = require('pug-parser');
const wrap = require('pug-runtime/wrap');
const generateCode = require('pug-code-gen');

export default function getSlots(parts) {
  const output = {}
  if (parts.template && parts.template.content) {
    let template = parts.template.content
    let lastComment = ''

    if(parts.template.attrs.lang === 'pug') {
        const funcStr = generateCode(parse(lex(parts.template.content)), {
          compileDebug: false,
          pretty: true,
          inlineRuntimeFunctions: false,
          templateName: '_parse',
        });
        const func = wrap(funcStr, '_parse');
        template = func();
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
