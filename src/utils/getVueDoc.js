import { IGNORE_DEFAULT, getDescription, getComment , EMPTY} from './variables';
import processTags from './processTags';
import processProps from './processProps';
import processMethods from './processMethods';
import processEvents from './processEvents';

export default function getVueDoc(docFile, component) {
	let displayName;
	let docComponent;
	if (!component.name || component.name === '') {
		throw new Error("The component has no name, add 'name' property on the Vue component");
	}
	displayName = component.name;
	if (docFile) {
		docFile = docFile.filter( comment => {
			return comment.kind !== 'package'
		});
		docComponent = docFile.filter(comment => {
			return comment.longname === 'module.exports'
		})[0];
	} else {
		docFile = [];
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
	const events = processEvents(docFile, component);

	return {
		description,
		methods,
		displayName,
		props,
		comment,
		tags,
		events,
	}
}
