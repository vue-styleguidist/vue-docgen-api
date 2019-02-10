import { ComponentDoc, Documentation } from './Documentation'
import { parseFile, ParseOptions, parseSource as parseSourceLocal } from './parse'

export { ComponentDoc, ParseOptions }

export function parse(
  filePath: string,
  opts?: ParseOptions | { [alias: string]: string },
): ComponentDoc {
  const doc = new Documentation()
  const options: ParseOptions = isParserOptions(opts) ? opts : { filePath, aliases: opts }
  parseFile(doc, options)
  return doc.toObject()
}

export function parseSource(
  source: string,
  filePath: string,
  opts?: ParseOptions | { [alias: string]: string },
): ComponentDoc {
  const doc = new Documentation()
  const options: ParseOptions = isParserOptions(opts) ? opts : { filePath, aliases: opts }
  parseSourceLocal(doc, source, options)
  return doc.toObject()
}

function isParserOptions(opts: any): opts is ParseOptions {
  return !!opts && !!opts.aliases
}
