import parser from './parser'
import getComponentModuleJSCode from './getComponentModuleJSCode'
import getSlots from './getSlots'
import getDocFile from './getDocFile'

class stateDoc {
  constructor() {
    this.file = ''
    this.docComponent = {}
    this.sourceComponent = ''
    this.docMixins = []
    this.jscodeRequest = ''
    this.jscodeLang = undefined
    this.docTemp = ''
    this.slots
  }

  isMainComponent(file) {
    return file === this.file
  }

  saveComponent(source, file) {
    if (this.isMainComponent(file) && this.sourceComponent !== source) {
      const parts = parser(source, 'name')
      this.slots = getSlots(parts)
      this.docComponent = []
      if (parts.script) {
        this.jscodeRequest = getComponentModuleJSCode(parts, source, file)
        this.jscodeLang = parts.script.lang
        this.docComponent = this.getDocFile(this.jscodeRequest, file, this.jscodeLang)
      }
    }
  }

  getDocFile(source, file, lang) {
    this.docTemp = getDocFile(source, file, lang)
    return this.docTemp
  }

  isMixin(doc) {
    doc = doc || this.docTemp
    return doc.some(docPart => {
      return docPart.kind === 'mixin'
    })
  }

  getDocJs() {
    let docMixins = [].concat.apply([], this.docMixins).filter(function(docPart) {
      return docPart.kind !== 'package'
    })
    return this.docComponent.concat(docMixins)
  }

  saveMixin(doc, file) {
    if (this.isMixin(doc)) {
      doc = doc
        .map(docPart => {
          let longnameSplit = docPart.longname.split('.')
          if (longnameSplit[0] === 'default') {
            longnameSplit[0] = 'module.exports'
          }
          docPart.longname = longnameSplit.join('.')
          return docPart
        })
        .filter(docPart => {
          return docPart.longname !== 'module.exports'
        })
      let index
      this.docMixins.forEach((docMixin, id) => {
        const packages = docMixin.filter(function(docPart) {
          return docPart.kind === 'package'
        })[0]
        if (packages && packages.files[0] === file) {
          index = id
        }
      })
      if (!index) {
        this.docMixins.unshift(doc)
      }
    }
  }

  reset() {
    this.file = ''
    this.docComponent = {}
    this.sourceComponent = ''
    this.docMixins = []
    this.jscodeRequest = ''
    this.jscodeLang = undefined
    this.docTemp = ''
  }
}

export default new stateDoc()
