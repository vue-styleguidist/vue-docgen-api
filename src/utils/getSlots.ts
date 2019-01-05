import { Parser as HtmlParser } from 'htmlparser2';

import { Lexer } from 'pug-lexer';
import { Parser } from 'pug-parser';
import wrap from 'pug-runtime/wrap';
import generateCode from 'pug-code-gen';
import { Template } from 'vue-sfc';

export default function getSlots(tpl: Template) {
  const output: { [name: string]: { description?: string } } = {};
  if (tpl && tpl.content) {
    let template = tpl.content;
    let lastComment = '';

    if (tpl.attrs && tpl.attrs.lang === 'pug') {
      const lexed = new Lexer(tpl.content);
      const parsed = new Parser(lexed.tokens);
      const funcStr = generateCode(parsed, {
        compileDebug: false,
        pretty: true,
        inlineRuntimeFunctions: false,
        templateName: '_parse',
      });
      const func = wrap(funcStr, '_parse');
      template = func();
    }

    const parser = new HtmlParser({
      oncomment: (data) => {
        if (data.search(/\@slot/) !== -1) {
          lastComment = data.replace('@slot', '').trim();
        }
      },
      ontext: (text) => {
        if (text.trim()) {
          lastComment = '';
        }
      },
      onopentag: (name, attrs) => {
        if (name === 'slot') {
          const nameSlot = attrs.name || 'default';
          output[nameSlot] = {
            description: lastComment,
          };

          lastComment = '';
        }
      },
    });

    parser.write(template);
    parser.end();
    return output;
  }
  return {};
}
