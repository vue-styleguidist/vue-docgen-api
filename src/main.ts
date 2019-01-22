import { ComponentDoc, Documentation } from './Documentation'
import { parseFile, parseSource as parseSourceLocal } from './parse'

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
