import { IGNORE_DEFAULT, getDescription, getComment } from './variables';
import processTags from './processTags';
import processProps from './processProps';
import processMethods from './processMethods';

const getFileName = (fileName) => {
	return fileName.split('\\').reverse()[0].split('.')[0]
}

const capitalizeFirstLetter = (str) => {
  return str[0].toUpperCase() + str.substr(1)
}

const kebabToCamel= (myString) => {
  return myString.replace(/-([aA-zZ])/g, function (g) { return g[1].toUpperCase() })
}

function getFileNameComponent(doc) {
	const packageComponent = doc.filter( comment => {
		return comment.kind === 'package'
	} )[0];
	const fileName = packageComponent['files'][0];
	return capitalizeFirstLetter(kebabToCamel(getFileName(fileName)));
}

export default function getVueDoc(docFile, component) {
	try {
		const displayName = getFileNameComponent(docFile);
		docFile = docFile.filter( comment => {
			return comment.kind !== 'package'
		});
		const docComponent = docFile.filter(comment => {
			return comment.longname === 'module.exports'
		})[0];
		const description = getDescription(docComponent);
		const comment = getComment(docComponent);
		const tags = processTags(docComponent, IGNORE_DEFAULT);
		const props = processProps(docFile, component);
		const methods = processMethods(docFile, component);

		return {
			description,
			methods,
			displayName,
			props,
			comment,
			tags,
		}

	} catch (e) {
		console.log(e)
	}
}
