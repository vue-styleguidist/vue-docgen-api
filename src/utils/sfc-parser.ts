import hash from 'hash-sum';
import { parseComponent } from 'vue-template-compiler';
import { CompiledSFC } from 'vue-sfc';
import LRUCache from 'lru-cache';

const cache = new LRUCache(250);

export default function scfParser(source: string, filename: string): CompiledSFC {
  const cacheKey = hash(filename + source);
  // source-map cache busting for hot-reloadded modules
  let output: CompiledSFC = cache.get(cacheKey);
  if (output) {
    return output;
  }
  output = parseComponent(source, { pad: true });
  cache.set(cacheKey, output);
  return output;
}
