import * as bt from '@babel/types';
import getDoclets, { ParamTag, DocBlockTags, ParamType, Tag } from './getDoclets';
import { parseDocblock } from './getDocblock';
import { BlockTag } from './blockTags';

interface EventType {
  names: string[];
}

interface EventProperty {
  type: EventType;
  name?: string;
  description?: string | boolean;
}

interface DocBlockTagEvent extends DocBlockTags {
  type?: EventType;
  properties: EventProperty[] | undefined;
}

interface TypedParamTag extends ParamTag {
  type: ParamType;
}

export default function getEvents(ast: bt.File) {
  if (Array.isArray(ast.comments)) {
    const eventCommentBlocksDoclets = ast.comments.reduce((acc, comment: bt.Comment) => {
      // only observe block comments
      if (comment.type !== 'CommentBlock') {
        return acc;
      }

      const doc: DocBlockTagEvent = {
        properties: undefined,
        ...getDoclets(parseDocblock(comment.value)),
      };

      // filter comments where a tag is @event
      const nonNullTags: BlockTag[] = doc.tags ? doc.tags : [];
      const eventTag = nonNullTags.filter((t: BlockTag) => t.title === 'event');

      if (eventTag.length) {
        const typeTags = nonNullTags.filter((tg) => tg.title === 'type');

        doc.type = typeTags.length
          ? { names: typeTags.map((tg: TypedParamTag) => tg.type.name) }
          : undefined;

        const propertyTags = nonNullTags.filter((tg) => tg.title === 'property');
        if (propertyTags.length) {
          doc.properties = propertyTags.map((tg: TypedParamTag) => {
            return { type: { names: [tg.type.name] }, name: tg.name, description: tg.description };
          });
        }

        // remove the property an type tags from the tag array
        const tags = nonNullTags.filter(
          (tg: BlockTag) => tg.title !== 'type' && tg.title !== 'property' && tg.title !== 'event',
        );

        if (tags.length) {
          doc.tags = tags;
        } else {
          delete doc.tags;
        }
        const t = eventTag[0];
        if (isTag(t) && typeof t.content === 'string') {
          acc[t.content] = doc;
        }
      }
      return acc;
    }, {});

    return eventCommentBlocksDoclets;
  } else {
    return {};
  }
}

function isTag(tag: BlockTag): tag is Tag {
  return typeof (tag as Tag).content === 'string';
}
