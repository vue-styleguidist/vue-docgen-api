import path from 'path'
import {
  IGNORE_DEFAULT,
  getDescription,
  getComment,
  EMPTY
} from './variables'
import processTags from './processTags'
import processProps from './processProps'
import processMethods from './processMethods'
import processEvents from './processEvents'

export default function getVueDoc(stateDoc, component) {
  let docJsFile = stateDoc.getDocJs()
  let docComponent

  const displayName = !component.name || component.name === '' ? // if component does not have a name, use the name of the file containing it
    path.basename(stateDoc.file, path.extname(stateDoc.file)) :
    component.name

  if (docJsFile) {
    docJsFile = docJsFile.filter(comment => {
      return comment.kind !== 'package'
    })
    docComponent = docJsFile.filter(comment => {
      return comment.longname === 'module.exports' || comment.longname === 'default' || comment.longname === '_default'
    })[0]
  } else {
    docJsFile = []
    docComponent = false
  }
  let description = EMPTY
  let comment = EMPTY
  let tags = {}
  if (docComponent) {
    description = getDescription(docComponent)
    comment = getComment(docComponent)
    tags = processTags(docComponent, IGNORE_DEFAULT)
  }
  const props = processProps(docJsFile, component)
  const methods = processMethods(docJsFile, component)
  const events = processEvents(docJsFile, component)

  return {
    description,
    methods,
    displayName,
    props,
    comment,
    tags,
    events,
    slots: stateDoc.slots,
  }
}
