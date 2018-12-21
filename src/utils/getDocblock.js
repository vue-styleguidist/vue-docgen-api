/**
 * Helper functions to work with docblock comments.
 */

function parseDocblock(str) {
  const lines = str.split('\n')
  for (let i = 0, l = lines.length; i < l; i++) {
    lines[i] = lines[i].replace(/^\s*\*\s?/, '')
  }
  return lines.join('\n').trim()
}

const DOCBLOCK_HEADER = /^\*\s/

/**
 * Given a path, this function returns the closest preceding docblock if it
 * exists.
 */
export function getDocblock(path, trailing = false) {
  let comments = []
  if (trailing && path.node.trailingComments) {
    comments = path.node.trailingComments.filter(
      comment => comment.type === 'CommentBlock' && DOCBLOCK_HEADER.test(comment.value)
    )
  } else if (path.node.leadingComments) {
    comments = path.node.leadingComments.filter(
      comment => comment.type === 'CommentBlock' && DOCBLOCK_HEADER.test(comment.value)
    )
  } else if (path.node.comments) {
    comments = path.node.comments.filter(
      comment => comment.leading && comment.type === 'Block' && DOCBLOCK_HEADER.test(comment.value)
    )
  }

  if (comments.length > 0) {
    return parseDocblock(comments[comments.length - 1].value)
  }
  return null
}
