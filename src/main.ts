import { ComponentDoc, Documentation } from './Documentation'
import { parseFile, parseSource as parseSourceLocal } from './parse'
import * as utils from './utils'

export { utils }

export { ComponentDoc }

export function parse(filePath: string): ComponentDoc {
  const doc = new Documentation()
  parseFile(filePath, doc)
  return doc.toObject()
}

export function parseSource(source: string, filePath: string): ComponentDoc {
  const doc = new Documentation()
  parseSourceLocal(source, filePath, doc)
  return doc.toObject()
}
