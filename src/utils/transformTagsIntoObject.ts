import blockTags, { BlockTag } from './blockTags';
import { ParamTag, Tag } from './getDoclets';

export default function transformTagsIntoObject(tags: BlockTag[]): { [key: string]: BlockTag[] } {
  return tags.reduce((acc: { [key: string]: BlockTag[] }, tag) => {
    if (blockTags.indexOf(tag.title) > -1) {
      if (isContentTag(tag)) {
        const newTag: ParamTag = {
          description: tag.content,
          title: tag.title,
        };
        tag = newTag;
      }
      acc[tag.title] = [tag];
    }
    return acc;
  }, {});
}

function isContentTag(tag: any): tag is Tag {
  return tag.content !== undefined;
}
