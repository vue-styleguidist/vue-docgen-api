import hash from 'hash-sum';
import compiler from 'vue-template-compiler';
import LRUCache from 'lru-cache';

const cache = new LRUCache(250);

export default function scfParser(source: string, filename: string) {
  const cacheKey = hash(filename + source);
  // source-map cache busting for hot-reloadded modules
  let output = cache.get(cacheKey);
  if (output) {
    return output;
  }
  output = compiler.parseComponent(source, { pad: true });
  cache.set(cacheKey, output);
  return output;
}
