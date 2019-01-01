import blockTags from './blockTags';

interface BlockTag {
  title: string;
  content: string;
}

export default function transformTagsIntoObject(tags: BlockTag[]): { [key: string]: string } {
  return tags.reduce((acc: { [key: string]: string }, i) => {
    if (blockTags.indexOf(i.title) > -1) {
      acc[i.title] = i.content;
    }
    return acc;
  }, {});
}
