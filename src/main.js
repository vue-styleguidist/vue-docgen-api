import fs from 'fs'
import * as utils from './utils'
import parseSource from './parse'

export { default as parseSource } from './parse'

export { utils }

export const parse = function(file) {
  const source = fs.readFileSync(file, {
    encoding: 'utf-8',
  })
  return parseSource(source)
}
