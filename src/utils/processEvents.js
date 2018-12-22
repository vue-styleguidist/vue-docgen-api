import { getDescription, getComment } from './variables'

export default function processEvents(docFile) {
	docFile = docFile.slice().reverse()
  const listDocEvents = {}
	const docParts = docFile.filter(comment => {
		return comment.kind === 'event'
	})
	docParts.forEach(function(docPart) {
		if (docPart.name) {
      listDocEvents[docPart.name] = {
				description: getDescription(docPart),
				type: docPart.type,
				properties: docPart.properties,
				comment: getComment(docPart),
			}
		}
	})
  return listDocEvents
}
