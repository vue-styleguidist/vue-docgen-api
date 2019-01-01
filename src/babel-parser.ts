import { File as BabelFile } from '@babel/types';
import { parse, ParserOptions } from '@babel/parser';

const babelParserOptions: ParserOptions = {
  sourceType: 'module',
  strictMode: false,
  tokens: true,
  plugins: [
    'jsx',
    'flow',
    'estree',
    'doExpressions',
    'objectRestSpread',
    'classProperties',
    'classPrivateProperties',
    'classPrivateMethods',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'asyncGenerators',
    'functionBind',
    'functionSent',
    'dynamicImport',
    'numericSeparator',
    'optionalChaining',
    'importMeta',
    'bigInt',
    'optionalCatchBinding',
    'throwExpressions',
    'nullishCoalescingOperator',
  ],
};

export default function buildParse(): { parse: (src: string) => BabelFile } {
  return {
    parse(src: string): BabelFile {
      return parse(src, babelParserOptions);
    },
  };
}
