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

/**
 * parses the source and returns the doc
 * @param {string} source code whose documentation is parsed
 * @param {string} filePath path of the current file against whom to resolve the mixins
 * @returns {object} documentation object
 */
export function parseFile(filePath: string, documentation: Documentation) {
  const source = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  })
  return parseSource(source, filePath, documentation)
}

/**
 * parses the source and returns the doc
 * @param {string} source code whose documentation is parsed
 * @param {string} filePath path of the current file against whom to resolve the mixins
 * @returns {object} documentation object
 */
export function parseSource(source: string, filePath: string, documentation: Documentation) {
  const singleFileComponent = /\.vue$/i.test(path.extname(filePath))
  let parts: SFCDescriptor | null = null

  if (source === '') {
    throw new Error(ERROR_EMPTY_DOCUMENT)
  }

  if (singleFileComponent) {
    parts = cacher(() => parseComponent(source), source)
  }

  const scriptSource = parts ? (parts.script ? parts.script.content : undefined) : source
  if (scriptSource) {
    const lang =
      (parts && parts.script && parts.script.attrs && parts.script.attrs.lang === 'ts') ||
      /\.tsx?$/i.test(path.extname(filePath))
        ? 'ts'
        : 'js'
    parseScript(scriptSource, documentation, handlers, { lang, filePath })
  }

  // get slots from template
  if (parts && parts.template) {
    parseTemplate(parts.template, documentation, templateHandlers, filePath)
  }

  if (!documentation.get('displayName')) {
    // a component should always have a display name
    documentation.set('displayName', path.basename(filePath).replace(/\.\w+$/, ''))
  }
}
