export default function transformTagsIntoObject(tags) {
  return tags.reduce((acc, i) => {
    acc[i.title] = i.content
    return acc
  }, {})
}
