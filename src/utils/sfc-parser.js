import hash from 'hash-sum'

const compiler = require('vue-template-compiler')
const cache = require('lru-cache')(100)

export default function scfParser(source, filename) {
  const cacheKey = hash(filename + source)
  // source-map cache busting for hot-reloadded modules
  let output = cache.get(cacheKey)
  if (output) {
    return output
  }
  output = compiler.parseComponent(source, { pad: true })
  cache.set(cacheKey, output)
  return output
}
