import fs from 'fs'
import getSandbox from './utils/getSandbox'
import getVueDoc from './utils/getVueDoc'
import stateDoc from './utils/stateDoc'

export const parse = function(file) {
  const source = fs.readFileSync(file, {
    encoding: 'utf-8',
  })
  return parseSource(source, file)
}

export const parseSource = function(source, path) {
  if (source === '') {
    throw new Error('The document is empty')
  }
  stateDoc.file = path
  stateDoc.saveComponent(source, path)
  const component = getSandbox(stateDoc, path).default
  const vueDoc = getVueDoc(stateDoc, component)
  stateDoc.reset()
  return vueDoc
}
