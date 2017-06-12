import getMethod from './getMethod';

export default function processMethods(docFile, component) {
	const listMethods = [];
	if (component.methods) {
		Object.keys(component.methods).forEach(methodName => {
			const docPart = docFile.filter( comment => {
				return (comment.longname.indexOf('methods.' + methodName) > -1)
			})[0];
			if ( docPart ) {
				if ( docPart['access'] && docPart['access'] === 'public' ) {
					listMethods.push(getMethod(methodName, docPart));
				}
			}
		});
	}
	return listMethods;
}
