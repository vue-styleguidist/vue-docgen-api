import { Parser } from 'pug-parser';
import { Lexer } from 'pug-lexer';
// tslint:disable-next-line:no-var-requires
const generateCode = require('pug-code-gen');
// tslint:disable-next-line:no-var-requires
const wrap = require('pug-runtime/wrap');

export default function getHtmlFromPug(pug: string): string {
  const lexed = new Lexer(pug);
  const parsed = new Parser(lexed.getTokens());
  const funcStr = generateCode(parsed.parse(), {
    compileDebug: false,
    pretty: true,
    inlineRuntimeFunctions: false,
    templateName: '_parse',
  });
  const func = wrap(funcStr, '_parse');
  return func();
}
