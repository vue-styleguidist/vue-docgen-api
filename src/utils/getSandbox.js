import evalComponentCode from './evalComponentCode'
import getSourceInRequire from './getSourceInRequire'
import getMixin from './getMixin'
import getExtends from './getExtends'
import parseModule from './parseModule'

module.exports = function getSandbox(stateDoc, file) {
  const parsedSource = parseModule(stateDoc.jscodeReqest, file, stateDoc.jscodeLang)
  const sandbox = evalComponentCode(parsedSource).exports
  const component = sandbox.default
  const listRequire = getSourceInRequire(parsedSource, file)
  const mixins = getMixin(listRequire).reverse()
  component.mixins = mixins
  if (component.extends) {
    component.mixins = getExtends(listRequire).reverse()
  }
  return sandbox
}
