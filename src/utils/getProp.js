import { EMPTY, UNDEFINED, IGNORE_DEFAULT, getDescription, getComment } from './variables';
import processTags from './processTags';
const fnNameMatchRegex = /^\s*function\s+([^\(\s]*)\s*/;

function getTypeName(prop) {
	if (!prop) return UNDEFINED;
	if ( Array.isArray(prop) ) {
		return prop.map(getTypeNameToFunction).join('|');
	} else {
		return getTypeNameToFunction(prop);
	}
}

function getTypeNameToFunction(object) {
	if (object.name.toLowerCase() === 'function') return 'func'
	return object.name.toLowerCase();
}

export default function getProp(prop, docPart){
	if ( prop ) {
		let obj = {};
		if ( Array.isArray(prop) ) {
			obj['type'] = {
				name: getTypeName(prop),
			};
		} else if (typeof prop === 'function') {
			obj['type'] = {
				name: getTypeName(prop),
			};
		} else {
			obj['type'] = {
				name: getTypeName(prop.type),
			};
			obj['required'] = prop.required || EMPTY;
			if (typeof prop.default !== UNDEFINED) {
				let value;
				if (typeof prop.default === 'function' && !prop.type || obj['type']['name'].includes('func')) {
					obj['type'] = { name: 'func' }
					var func = prop.default.toString().replace(fnNameMatchRegex, 'function');
					value = JSON.parse(JSON.stringify(func.replace(/\s\s+/g, ' ')))
				} else if (typeof prop.default === 'function' && prop.type) {
          value = JSON.stringify(prop.default())
				} else {
					if (!prop.type) {
						obj['type'] = { name: typeof prop.default }
					}
					value = JSON.stringify(prop.default)
				}
				obj['defaultValue'] = {
					value: value,
					computed: false,
				};
			}
		}
		obj['tags'] = processTags(docPart, IGNORE_DEFAULT);
		obj['comment'] = getComment(docPart);
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
