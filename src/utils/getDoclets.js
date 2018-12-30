const DOCLET_PATTERN = /^@(\w+)(?:$|\s((?:[^](?!^@\w))*))/gim

function getParamInfo(content) {
  const param = {}

  const typeSliceArray = /^\{([^}]+)\}/.exec(content)
  const typeSlice = typeSliceArray.length ? typeSliceArray[1] : '*'
  param.type = getTypeObjectFromTypeString(typeSlice)

  content = content.replace(`{${typeSlice}} `, '')

  const nameSliceArray = /^(\w+) - /.exec(content)
  if (nameSliceArray) {
    param.name = nameSliceArray[1]
  }

  content = content.replace(/^(\w+)? ?(- )?/, '')

  if (content.length) {
    param.description = content
  }

  return param
}

function getTypeObjectFromTypeString(typeSlice) {
  if (typeSlice === '' || typeSlice === '*') {
    return { name: 'mixed' }
  } else if (/\w+\|\w+/.test(typeSlice)) {
    return {
      name: 'union',
      elements: typeSlice.split('|').map(type => getTypeObjectFromTypeString(type)),
    }
  } else {
    return {
      name: typeSlice,
    }
  }
}

/**
 * Given a string, this functions returns an object with
 * two keys:
 * - `tags` an array of tags {title: tagname, content: }
 * - `description` whatever is left once the tags are removed
 */
export default function getDocblockTags(str) {
  const tags = []
  let match = DOCLET_PATTERN.exec(str)

  for (; match; match = DOCLET_PATTERN.exec(str)) {
    const title = match[1]
    if (title === 'param' || title === 'property' || title === 'type') {
      tags.push({ title, ...getParamInfo(match[2]) })
    } else {
      tags.push({ title, content: match[2] || true })
    }
  }

  const description = str.replace(DOCLET_PATTERN, '').trim()

  return { description, tags }
}
