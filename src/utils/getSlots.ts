import { Parser as HtmlParser } from 'htmlparser2';
import { SFCBlock } from 'vue-template-compiler';
import getHtmlFromPug from './getHtmlFromPug';

export default function getSlots(tpl: SFCBlock) {
  const output: { [name: string]: { description?: string } } = {};
  if (tpl && tpl.content) {
    const template =
      tpl.attrs && tpl.attrs.lang === 'pug' ? getHtmlFromPug(tpl.content) : tpl.content;
    let lastComment = '';

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
