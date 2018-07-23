export const EMPTY = ''

export const UNDEFINED = 'undefined'

export const IGNORE_DEFAULT = ['params', 'param', 'returns']

export function getDescription(docPart) {
  if (docPart) return docPart['description'] || EMPTY
  return EMPTY
}

export function getComment(docPart) {
  if (docPart) return docPart['comment'] || EMPTY
  return EMPTY
}
