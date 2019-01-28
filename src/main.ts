import { ComponentDoc, Documentation } from './Documentation'
import { parseFile, parseSource as parseSourceLocal } from './parse'

export { ComponentDoc }

export function parse(filePath: string, aliases?: { [alias: string]: string }): ComponentDoc {
  const doc = new Documentation()
  parseFile(doc, { filePath, aliases })
  return doc.toObject()
}

export function parseSource(
  source: string,
  filePath: string,
  aliases?: { [alias: string]: string },
): ComponentDoc {
  const doc = new Documentation()
  parseSourceLocal(doc, source, { filePath, aliases })
  return doc.toObject()
}
