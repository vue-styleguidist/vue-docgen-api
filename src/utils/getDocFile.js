const jsdoc = require('jsdoc-api');

export default function getDocFile (jscodeReqest, file) {
	try {
		let docReturn = jsdoc
			.explainSync({source: jscodeReqest})
			.filter(obj => obj.undocumented !== true)
			.map( obj => {
				if ( obj.meta ) {
					obj.meta.filename = file;
					obj.meta.path = file;
				} else {
					obj.files[0] = file;
				}
				return obj;
			});
		return docReturn;
	} catch (err) {
		const errorMessage = err.toString();
		console.log(`\n${errorMessage}\n`);
		throw new Error(err);
	}
}
