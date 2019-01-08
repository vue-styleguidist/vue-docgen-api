import { File as BabelFile, isBlock, Comment } from '@babel/types';
import getDoclets, { Tag, ParamTag, DocBlockTags, ParamType } from './getDoclets';
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

export default function getEvents(ast: BabelFile) {
  if (Array.isArray(ast.comments)) {
    const eventCommentBlocksDoclets = ast.comments.reduce((acc, comment: Comment) => {
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
      const eventTag: Tag | undefined = nonNullTags.find((t) => t.title === 'event') as Tag;

      if (eventTag) {
        const typeTags = nonNullTags.filter((t) => t.title === 'type');

        doc.type = typeTags.length
          ? { names: typeTags.map((t: TypedParamTag) => t.type.name) }
          : undefined;

        const propertyTags = nonNullTags.filter((t) => t.title === 'property');
        if (propertyTags.length) {
          doc.properties = propertyTags.map((t: TypedParamTag) => {
            return { type: { names: [t.type.name] }, name: t.name, description: t.description };
          });
        }

        // remove the property an type tags from the tag array
        const tags = nonNullTags.filter(
          (t: Tag | ParamTag) => t.title !== 'type' && t.title !== 'property' && t.title !== 'event',
        );

        if (tags.length) {
          doc.tags = tags;
        } else {
          delete doc.tags;
        }

        if (typeof eventTag.content === 'string') {
          acc[eventTag.content] = doc;
        }
      }
      return acc;
    }, {});

    return eventCommentBlocksDoclets;
  } else {
    return {};
  }
}
