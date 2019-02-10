import { ComponentDoc, Documentation } from './Documentation'
import { DocGenOptions, parseFile, ParseOptions, parseSource as parseSourceLocal } from './parse'

export { ComponentDoc, DocGenOptions }

export function parse(
  filePath: string,
  opts?: DocGenOptions | { [alias: string]: string },
): ComponentDoc {
  const doc = new Documentation()
  const options: ParseOptions = isOptionsObject(opts)
    ? { ...opts, filePath }
    : { filePath, alias: opts }
  parseFile(doc, options)
  return doc.toObject()
}

export function parseSource(
  source: string,
  filePath: string,
  opts?: DocGenOptions | { [alias: string]: string },
): ComponentDoc {
  const doc = new Documentation()
  const options: ParseOptions = isOptionsObject(opts)
    ? { ...opts, filePath }
    : { filePath, alias: opts }
  parseSourceLocal(doc, source, options)
  return doc.toObject()
}

function isOptionsObject(opts: any): opts is DocGenOptions {
  return !!opts && !!opts.alias
}
