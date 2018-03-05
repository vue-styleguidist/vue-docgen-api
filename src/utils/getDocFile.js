const jsdoc = require('jsdoc-api');
const path = require('path');
const { parseModule } = require('./parseModule')

export default function getDocFile (source, file, lang) {
	try {
		const parsedSource = parseModule(source, lang, '2017')
		let docReturn = jsdoc.explainSync({
				source: parsedSource,
				configure: path.join(path.dirname(__dirname), '..', 'config.json'),
		}).filter(obj => obj.undocumented !== true)
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
