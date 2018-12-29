import fs from 'fs'
import path from 'path'
import * as utils from './utils'
import parseSource from './parse'

export { default as parseSource } from './parse'

export { utils }

export function parse(file) {
  const singleFileComponent = /\.vue/i.test(path.extname(file))
  const source = fs.readFileSync(file, {
    encoding: 'utf-8',
  })
  return parseSource(source, singleFileComponent, file)
}
