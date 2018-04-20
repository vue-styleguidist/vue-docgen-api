import fs from 'fs'
import path from 'path'
import parser from './parser'
import getComponentModuleJSCode from './getComponentModuleJSCode'
import stateDoc from './stateDoc'
import parseModule from './parseModule'
import evalComponentCode from './evalComponentCode'

module.exports = function getExtends(listRequire) {
  const output = []
  listRequire.forEach(filePath => {
    const isComponent = path.extname(filePath) === '.vue'
    if (isComponent && fs.existsSync(filePath)) {
      const source = fs.readFileSync(filePath, {
        encoding: 'utf-8',
      })
      const parts = parser(source, 'name')
      const jscodeLang = parts.script.lang
      const jscode = getComponentModuleJSCode(parts, source, filePath)
      const doc = stateDoc.getDocFile(jscode, filePath, jscodeLang)
      stateDoc.saveMixin(doc, filePath)
      if (stateDoc.isMixin()) {
        const parsedSource = parseModule(jscode, stateDoc.jscodeLang)
        const mixin = evalComponentCode(parsedSource)
        if (Object.keys(mixin.exports).length === 0) {
          mixin.exports.default = mixin.module.exports
        }
        if (mixin.exports.default) {
          const component = mixin.exports.default
          delete component.title;
          output.push(component)
        }
      }
    }
  });
  return output
}
