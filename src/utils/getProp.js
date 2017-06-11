import { EMPTY, UNDEFINED, IGNORE_DEFAULT, getDescription, getComment } from './variables';
import processTags from './processTags';

function getTypeName(prop) {
	if (!prop) return UNDEFINED;
	if ( Array.isArray(prop) ) {
		return prop.map(getTypeNameToFunction).join('|');
	} else {
		return getTypeNameToFunction(prop);
	}
}

function getTypeNameToFunction(object) {
	return object.name.toLowerCase();
}

export default function getProp(prop, docPart){
	if ( prop ) {
		let obj = {};
		if ( typeof prop === 'function' || Array.isArray(prop) ) {
			obj['type'] = {
				name: getTypeName(prop),
			};
		} else {
			obj['type'] = {
				name: getTypeName(prop.type),
			};
			obj['required'] = prop.required || EMPTY;
			if (prop.default && typeof prop.default !== 'function' ) {
				obj['defaultValue'] = {
					value: JSON.stringify(prop.default),
					computed: false,
				};
			}
			obj['tags'] = processTags(docPart, IGNORE_DEFAULT);
			obj['comment'] = getComment(docPart);
		}
		obj['description'] = getDescription(docPart);
		return obj;
	} else {
		return {
			type: {
				name: UNDEFINED,
			},
			required: false,
			description: EMPTY,
			tags: {},
		}
	}
}
