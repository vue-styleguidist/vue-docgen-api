import { parseComponent, CompiledSFC } from 'vue-template-compiler';
// tslint:disable-next-line:no-var-requires
const LRUCache = require('lru-cache');
// tslint:disable-next-line:no-var-requires
const hash = require('hash-sum');

const cache = new LRUCache(250);

export default function scfParser(source: string, filename: string): CompiledSFC {
  const hashTmp = hash;
  const cacheKey = hashTmp(filename + source);
  // source-map cache busting for hot-reloadded modules
  let output: CompiledSFC = cache.get(cacheKey);
  if (output) {
    return output;
  }
  output = parseComponent(source, { pad: true });
  cache.set(cacheKey, output);
  return output;
}
