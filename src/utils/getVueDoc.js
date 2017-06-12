import { IGNORE_DEFAULT, getDescription, getComment , EMPTY} from './variables';
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
	let displayName;
	let docComponent;
	if (docFile) {
		displayName = getFileNameComponent(docFile);
		docFile = docFile.filter( comment => {
			return comment.kind !== 'package'
		});
		docComponent = docFile.filter(comment => {
			return comment.longname === 'module.exports'
		})[0];
	} else {
		docFile = [];
		displayName = component.name || EMPTY;
		docComponent = false;
	}
	let description = EMPTY;
	let comment = EMPTY;
	let tags = {};
	if (docComponent) {
		description = getDescription(docComponent);
		comment = getComment(docComponent);
		tags = processTags(docComponent, IGNORE_DEFAULT);
	}
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
}
