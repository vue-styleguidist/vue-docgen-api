import fs from 'fs'
import path from 'path'
import stateDoc from './stateDoc'
import parseModule from './parseModule'
import evalComponentCode from './evalComponentCode'

module.exports = function getMixin(listRequire) {
  const output = []
  listRequire.forEach(filePath => {
    let pathRequire = filePath
    try {
      if (fs.lstatSync(pathRequire).isDirectory()) {
        pathRequire = path.join(pathRequire, 'index.js')
      }
    } catch (e) {}
    const hasJSExt = path.extname(pathRequire) === '.js'
    if (!hasJSExt) {
      pathRequire = filePath + '.js'
    }
    if (fs.existsSync(pathRequire)) {
      const source = fs.readFileSync(pathRequire, {
        encoding: 'utf-8',
      })
      const doc = stateDoc.getDocFile(source, pathRequire)
      stateDoc.saveMixin(doc, pathRequire)
      if (stateDoc.isMixin()) {
        const parsedSource = parseModule(source, filePath, stateDoc.jscodeLang)
        const mixin = evalComponentCode(parsedSource)
        if (Object.keys(mixin.exports).length === 0) {
          mixin.exports.default = mixin.module.exports
        }
        if (mixin.exports.default) {
          output.push(mixin.exports.default)
        }
      }
    }
  })
  return output
}
