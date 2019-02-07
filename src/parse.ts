import * as fs from 'fs'
import * as path from 'path'
import { parseComponent, SFCDescriptor } from 'vue-template-compiler'
import { Documentation } from './Documentation'
import parseScript from './parse-script'
import parseTemplate from './parse-template'
import handlers from './script-handlers'
import templateHandlers from './template-handlers'
import cacher from './utils/cacher'

const ERROR_EMPTY_DOCUMENT = 'The passed source is empty'

export interface ParseOptions {
  filePath: string
  lang?: 'ts' | 'js'
  nameFilter?: string[]
  aliases?: { [alias: string]: string }
}

/**
 * parses the source and returns the doc
 * @param {string} source code whose documentation is parsed
 * @param {string} filePath path of the current file against whom to resolve the mixins
 * @returns {object} documentation object
 */
export function parseFile(documentation: Documentation, opt: ParseOptions) {
  const source = fs.readFileSync(opt.filePath, {
    encoding: 'utf-8',
  })
  return parseSource(documentation, source, opt)
}

/**
 * parses the source and returns the doc
 * @param {string} source code whose documentation is parsed
 * @param {string} filePath path of the current file against whom to resolve the mixins
 * @returns {object} documentation object
 */
export function parseSource(documentation: Documentation, source: string, opt: ParseOptions) {
  const singleFileComponent = /\.vue$/i.test(path.extname(opt.filePath))
  let parts: SFCDescriptor | null = null

  if (source === '') {
    throw new Error(ERROR_EMPTY_DOCUMENT)
  }

  if (singleFileComponent) {
    parts = cacher(() => parseComponent(source), source)
  }

  // get slots and props from template
  if (parts && parts.template) {
    parseTemplate(parts.template, documentation, templateHandlers, opt.filePath)
  }

  const scriptSource = parts ? (parts.script ? parts.script.content : undefined) : source
  if (scriptSource) {
    opt.lang =
      (parts && parts.script && parts.script.attrs && parts.script.attrs.lang === 'ts') ||
      /\.tsx?$/i.test(path.extname(opt.filePath))
        ? 'ts'
        : 'js'

    parseScript(scriptSource, documentation, handlers, opt)
  }

  if (!documentation.get('displayName')) {
    // a component should always have a display name
    documentation.set('displayName', path.basename(opt.filePath).replace(/\.\w+$/, ''))
  }
}
