import { getDescription, getComment } from './variables';
import processTags from './processTags';

function getParams(tags){
	if ( tags['params'] ) {
		return tags['params'].map( param =>{
			let obj = {
				name: param.name,
				description: param.description,
			};
			if ( param['type'] ) {
				obj['type'] = {
					name : param['type']['name'],
				}
			}
			return obj;
		})
	}
	return [];
}

function getReturns(tags){
	if ( tags['returns'] ) {
		const re = tags['returns'][0];
		let obj = {
			description: re.description,
		}
		if ( re['type'] ) {
			obj['type'] = {
				name: re['type']['name'],
			}
		}
		return obj;
	}
	return {};
}

export default function getMethod(methodName, docPart) {
	const tags = processTags(docPart);
	return {
		name: methodName,
		comment: getComment(docPart),
		modifiers: [],
		params: getParams(tags),
		returns: getReturns(tags),
		description: getDescription(docPart),
		tags,
	};
}
