import * as fs from 'fs'
import * as path from 'path'
import { parseComponent, SFCDescriptor } from 'vue-template-compiler'
import { Documentation } from './Documentation'
import parseScript, { Handler as ScriptHandler } from './parse-script'
import parseTemplate, { Handler as TemplateHandler } from './parse-template'
import scriptHandlers from './script-handlers'
import templateHandlers from './template-handlers'
import cacher from './utils/cacher'

const ERROR_EMPTY_DOCUMENT = 'The passed source is empty'

export interface ParseOptions extends DocGenOptions {
  filePath: string
  /**
   * In what language is the component written
   * @default undefined - let the system decide
   */
  lang?: 'ts' | 'js'
}

export interface DocGenOptions {
  /**
   * Which exported variables should be looked at
   * @default undefined - means treat all dependencies
   */
  nameFilter?: string[]
  /**
   * What alias should be replaced in requires and imports
   */
  alias?: { [alias: string]: string }
  /**
   * What directories should be searched when resolving modules
   */
  modules?: string[]
  /**
   * Handlers that will be added at the end of the script analysis
   */
  addScriptHandlers?: ScriptHandler[]
  /**
   * Handlers that will be added at the end of the template analysis
   */
  addTemplateHandlers?: TemplateHandler[]
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
    const addTemplateHandlers: TemplateHandler[] = opt.addTemplateHandlers || []
    parseTemplate(
      parts.template,
      documentation,
      [...templateHandlers, ...addTemplateHandlers],
      opt.filePath,
    )
  }

  const scriptSource = parts ? (parts.script ? parts.script.content : undefined) : source
  if (scriptSource) {
    opt.lang =
      (parts && parts.script && parts.script.attrs && parts.script.attrs.lang === 'ts') ||
      /\.tsx?$/i.test(path.extname(opt.filePath))
        ? 'ts'
        : 'js'
    const addScriptHandlers: ScriptHandler[] = opt.addScriptHandlers || []
    parseScript(scriptSource, documentation, [...scriptHandlers, ...addScriptHandlers], opt)
  }

  if (!documentation.get('displayName')) {
    // a component should always have a display name
    documentation.set('displayName', path.basename(opt.filePath).replace(/\.\w+$/, ''))
  }
}
