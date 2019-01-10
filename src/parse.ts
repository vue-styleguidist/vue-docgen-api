import * as path from 'path';
import scfParser from './utils/sfc-parser';
import buildParser from './babel-parser';
import * as bt from '@babel/types';
import getRequiredExtendsDocumentations from './utils/getRequiredExtendsDocumentations';
import getRequiredMixinDocumentations from './utils/getRequiredMixinDocumentations';
import resolveExportedComponent from './utils/resolveExportedComponent';
import getEvents from './utils/getEvents';
import { Documentation, ComponentDoc } from './Documentation';
import handlers from './handlers';
import templateHandlers from './templateHandlers';
import parseTemplate from './template-parser';
import { NodePath } from 'ast-types';
import { SFCDescriptor } from 'vue-template-compiler';
import { ParserPlugin } from '@babel/parser';

// tslint:disable-next-line:no-var-requires
const deepmerge = require('deepmerge');

const ERROR_MISSING_DEFINITION = 'No suitable component definition found';
const ERROR_EMPTY_DOCUMENT = 'The passed source is empty';

function executeHandlers(
  localHandlers: Array<(doc: Documentation, componentDefinition: NodePath) => void>,
  componentDefinitions: NodePath[],
  mixinsDocumentations: { props?: any; data?: any },
) {
  return componentDefinitions.map((compDef) => {
    const documentation = new Documentation(mixinsDocumentations);
    localHandlers.forEach((handler) => handler(documentation, compDef));
    return documentation.toObject();
  });
}

/**
 * parses the source and returns the doc
 * @param {string} source code whose documentation is parsed
 * @param {string} filePath path of the current file against whom to resolve the mixins
 * @returns {object} documentation object
 */
export default function parse(source: string, filePath: string): ComponentDoc {
  const singleFileComponent = /\.vue$/i.test(path.extname(filePath));
  let parts: SFCDescriptor | null = null;
  let vueDocArray: ComponentDoc[] = [];
  let ast: bt.File | null = null;
  if (singleFileComponent) {
    parts = scfParser(source, filePath);
  }

  if (source === '') {
    throw new Error(ERROR_EMPTY_DOCUMENT);
  }

  const originalSource = parts ? (parts.script ? parts.script.content : undefined) : source;
  if (originalSource) {
    const plugins: ParserPlugin[] =
      (parts && parts.script && parts.script.attrs && parts.script.attrs.lang === 'ts') ||
      /\.tsx?$/i.test(path.extname(filePath))
        ? ['typescript']
        : ['flow'];

    ast = buildParser({ plugins }).parse(originalSource);

    const componentDefinitions = resolveExportedComponent(ast.program);

    if (componentDefinitions.length === 0) {
      throw new Error(ERROR_MISSING_DEFINITION);
    }

    // extends management
    const extendsDocumentations =
      getRequiredExtendsDocumentations(ast.program, componentDefinitions, filePath) || {};

    // mixins management
    const mixinsDocumentations = getRequiredMixinDocumentations(
      ast.program,
      componentDefinitions,
      filePath,
    );

    // merge all the varnames found in the mixins
    const mixinDocs = Object.keys(mixinsDocumentations).reduce((acc, mixinVar) => {
      return deepmerge(acc, mixinsDocumentations[mixinVar]);
    }, extendsDocumentations);

    vueDocArray = executeHandlers(handlers, componentDefinitions, mixinDocs);
  }

  const doc: ComponentDoc = vueDocArray.length
    ? vueDocArray[0]
    : {
        displayName: '',
        description: '',
        methods: [],
        props: undefined,
        slots: {},
        tags: {},
      };

  // a component should always have a display name
  if (!doc.displayName || !doc.displayName.length) {
    doc.displayName = path.basename(filePath).replace(/\.\w+$/, '');
  }

  // get events from comments
  doc.events = ast ? getEvents(ast) : {};

  // get slots from template
  if (parts && parts.template) {
    parseTemplate(parts.template, doc, templateHandlers);
  }

  return doc;
}
