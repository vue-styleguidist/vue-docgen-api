import getMethod from './getMethod';

export default function processMethods(docFile, component) {
	docFile = docFile.slice();
	let methods = component.methods;
	const listDocMethods = [];
	let mixins = component.mixins;
	if ( mixins ) {
		mixins.forEach(mixin => {
			const mMixin = mixin.methods;
			if (mMixin) {
				methods = Object.assign({}, mMixin, methods);
			}
		});
	}
	if (methods) {
		const listDocParts = [];
		Object.keys(methods).forEach(methodName => {
			const docPart = docFile.reverse().filter( comment => {
				return (comment.longname.indexOf('methods.' + methodName) > -1 &&
				listDocParts.indexOf(comment.longname) === -1)
			})[0];
			if ( docPart ) {
				if ( docPart['access'] && docPart['access'] === 'public' ) {
					listDocParts.push(docPart.longname);
					listDocMethods.push(getMethod(methodName, docPart));
				}
			}
		});
	}
	return listDocMethods;
}
