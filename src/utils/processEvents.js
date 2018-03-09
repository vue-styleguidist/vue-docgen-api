import { getDescription, getComment } from './variables'

export default function processMethods(docFile) {
	docFile = docFile.slice().reverse()
	const listDocMethods = {}
	const docParts = docFile.filter(comment => {
		return comment.kind === 'event'
	})
	docParts.forEach(function(docPart) {
		if (docPart.name) {
			listDocMethods[docPart.name] = {
				description: getDescription(docPart),
				type: docPart.type,
				properties: docPart.properties,
				comment: getComment(docPart),
			}
		}
	})
	return listDocMethods
}
