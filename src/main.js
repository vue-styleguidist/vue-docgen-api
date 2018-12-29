import fs from 'fs'
import * as utils from './utils'
import parseSource from './parse'

export { default as parseSource } from './parse'

export { utils }

export function parse(filePath) {
  const source = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  })
  return parseSource(source, filePath)
}
