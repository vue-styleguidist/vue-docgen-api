import getComponentModuleJSCode from './getComponentModuleJSCode';
import getDocFile from './getDocFile';

class stateDoc {
	constructor(){
		this.file = '';
		this.docComponent = {};
		this.sourceComponent = '';
		this.docMixins = [];
	}

	isMainComponent(file){
		return file === this.file;
	}

	saveComponent(source, file){
		if (this.isMainComponent(file) && this.sourceComponent !== source) {
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

	getDoc(){
		let docMixins = [].concat.apply([], this.docMixins)
											.filter(function (docPart) {
												return docPart.kind !== 'package';
											});
		return docMixins.concat(this.docComponent);
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
			})
			let index;
			this.docMixins.forEach((docMixin, id) => {
				const packages = docMixin.filter(function (docPart) {
					return docPart.kind === 'package';
				})[0];
				if (packages && packages.files[0] === file) {
					index = id;
				}
			})
			if (index) {
				this.docMixins[index] = doc;
			} else {
				this.docMixins.push(doc)
			}
		}
	}
}

export default new stateDoc();
