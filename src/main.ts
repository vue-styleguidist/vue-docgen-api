import { ComponentDoc, Documentation } from './Documentation'
import { parseFile, parseSource as parseSourceLocal } from './parse'

export { ComponentDoc }

export function parse(filePath: string): ComponentDoc {
  const doc = new Documentation()
  parseFile(doc, { filePath })
  return doc.toObject()
}

export function parseSource(source: string, filePath: string): ComponentDoc {
  const doc = new Documentation()
  parseSourceLocal(doc, source, { filePath })
  return doc.toObject()
}
