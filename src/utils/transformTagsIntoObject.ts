import blockTags from './blockTags';

interface BlockTag {
  title: string;
  content?: string;
  description?: string;
}

export default function transformTagsIntoObject(tags: BlockTag[]): { [key: string]: BlockTag[] } {
  return tags.reduce((acc: { [key: string]: BlockTag[] }, tag) => {
    if (blockTags.indexOf(tag.title) > -1) {
      if (tag.content) {
        tag.description = tag.content;
        delete tag.content;
      }
      acc[tag.title] = [tag];
    }
    return acc;
  }, {});
}
