import * as bt from '@babel/types'
import * as path from 'path'
import { SFCDescriptor } from 'vue-template-compiler'
import { ComponentDoc } from './Documentation'
import parseScript from './parse-script'
import parseTemplate from './parse-template'
import handlers from './script-handlers'
import templateHandlers from './template-handlers'
import getEvents from './utils/getEvents'
import scfParser from './utils/sfc-parser'

const ERROR_EMPTY_DOCUMENT = 'The passed source is empty'

/**
 * parses the source and returns the doc
 * @param {string} source code whose documentation is parsed
 * @param {string} filePath path of the current file against whom to resolve the mixins
 * @returns {object} documentation object
 */
export default function parse(source: string, filePath: string): ComponentDoc {
  const singleFileComponent = /\.vue$/i.test(path.extname(filePath))
  let parts: SFCDescriptor | null = null

  if (source === '') {
    throw new Error(ERROR_EMPTY_DOCUMENT)
  }

  if (singleFileComponent) {
    parts = scfParser(source, filePath)
  }

  const scriptSource = parts ? (parts.script ? parts.script.content : undefined) : source
  let parsed: { doc: ComponentDoc; ast: bt.File } | null = null
  if (scriptSource) {
    const lang =
      (parts && parts.script && parts.script.attrs && parts.script.attrs.lang === 'ts') ||
      /\.tsx?$/i.test(path.extname(filePath))
        ? 'ts'
        : 'js'
    parsed = parseScript(scriptSource, handlers, { lang, filePath })
  }

  const doc: ComponentDoc = parsed
    ? parsed.doc
    : {
        displayName: '',
        description: '',
        methods: [],
        props: undefined,
        slots: {},
        tags: {},
      }

  // a component should always have a display name
  if (!doc.displayName || !doc.displayName.length) {
    doc.displayName = path.basename(filePath).replace(/\.\w+$/, '')
  }

  // get events from comments
  doc.events = parsed ? getEvents(parsed.ast) : {}

  // get slots from template
  if (parts && parts.template) {
    parseTemplate(parts.template, doc, templateHandlers, filePath)
  }

  return doc
}
