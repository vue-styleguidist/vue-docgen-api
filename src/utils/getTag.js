import { EMPTY } from './variables'

function isExistInTagList(docPart, tagName) {
  return docPart['tags'].some(tagObj => {
    return tagObj['title'] === tagName
  })
}

function generateTag(title, description, type) {
  let obj = { title, description }
  if (typeof type !== 'undefined') {
    obj['type'] = type
  }
  return obj
}

function getReturns(tagDoc) {
  return tagDoc.map(param => {
    let ret = {
      title: 'returns',
      description: param.description || EMPTY,
    }
    if (param.type && param.type.names) {
      ret['type'] = {
        type: 'NameExpression',
        name: param.type.names.join('|'),
      }
    }
    return ret
  })
}

function getParams(tagDoc) {
  return tagDoc.map(param => {
    let ret = {
      title: 'param',
      description: param.description || EMPTY,
      name: param.name || EMPTY,
    }
    if (param.type && param.type.names) {
      ret['type'] = {
        type: 'NameExpression',
        name: param.type.names.join('|'),
      }
    }
    return ret
  })
}

export default function getTag(tagName, docPart) {
  const tagDoc = docPart[tagName]
  if (tagDoc) {
    if (typeof tagDoc === 'string' || typeof tagDoc === 'boolean') {
      return [generateTag(tagName, tagDoc)]
    } else if (Array.isArray(tagDoc)) {
      if (tagName === 'params') {
        return getParams(tagDoc)
      } else if (tagName === 'returns') {
        return getReturns(tagDoc)
      } else {
        return tagDoc.map(description => {
          return generateTag(tagName, description)
        })
      }
    }
    return false
  } else if (docPart['tags'] && isExistInTagList(docPart, tagName)) {
    return docPart['tags']
      .filter(tagObj => {
        return tagObj['title'] === tagName
      })
      .map(tagObj => {
        return generateTag(tagName, tagObj['text'])
      })
  }
  return false
}
