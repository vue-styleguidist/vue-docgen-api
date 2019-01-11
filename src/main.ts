import * as fs from 'fs'
import { ComponentDoc } from './Documentation'
import parseSource from './parse'
import * as utils from './utils'

export { default as parseSource } from './parse'

export { utils }

export { ComponentDoc }

export function parse(filePath: string): ComponentDoc {
  const source = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  })
  return parseSource(source, filePath)
}
