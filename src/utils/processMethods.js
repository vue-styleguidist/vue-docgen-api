import getMethod from './getMethod';

export default function processMethods(docFile, component) {
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
		Object.keys(methods).forEach(methodName => {
			const docPart = docFile.reverse().filter( comment => {
				return (comment.longname.indexOf('methods.' + methodName) > -1)
			})[0];
			if ( docPart ) {
				if ( docPart['access'] && docPart['access'] === 'public' ) {
					listDocMethods.push(getMethod(methodName, docPart));
				}
			}
		});
	}
	return listDocMethods;
}
