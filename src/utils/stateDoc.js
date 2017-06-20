import getComponentModuleJSCode from './getComponentModuleJSCode';
import getDocFile from './getDocFile';

class stateDoc {
	constructor(){
		this.file = '';
		this.docComponent = false
		this.docMixins = [];
	}

	isMainComponent(file){
		return file === this.file;
	}

	saveComponent(source, file){
		if (!this.docComponent) {
			const jscodeReqest = getComponentModuleJSCode(source, file);
			const doc = getDocFile(jscodeReqest, file);
			this.docComponent = doc;
		}
	}

	isMixin(doc) {
		return doc.some(docPart => {
			return docPart.kind === 'mixin'
		});
	}

	saveMixin(source, file) {
		let doc = getDocFile(source, file);
		if (this.isMixin(doc)) {

			doc = doc.map(docPart =>{
				let longnameSplit = docPart.longname.split('.');
				if (longnameSplit[0] === 'default') {
					longnameSplit[0] = 'module.exports';
				}
				docPart.longname = longnameSplit.join('.');
				return docPart;
			}).filter(docPart => {
				return docPart.longname !== 'module.exports'
			}).filter(docPart => {
				return docPart.kind !== 'package'
			})
			this.docComponent = this.docComponent.concat(doc);
		}
	}
}

export default new stateDoc();
