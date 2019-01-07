import fs from 'fs';
import * as utils from './utils';
import parseSource from './parse';
import { ComponentDoc } from './Documentation';

export { default as parseSource } from './parse';

export { utils };

export function parse(filePath: string): ComponentDoc {
  const source = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  });
  return parseSource(source, filePath);
}
