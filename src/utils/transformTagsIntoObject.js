import blockTags from './blockTags'

export default function transformTagsIntoObject(tags) {
  return tags.reduce((acc, i) => {
    if (blockTags.indexOf(i.title) > -1) {
      acc[i.title] = i.content
    }
    return acc
  }, {})
}
