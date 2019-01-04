import { File as BabelFile } from '@babel/types';
import { namedTypes as types } from 'ast-types';
import getDoclets, { Tag, ParamTag, DocBlockTags } from './getDoclets';
import { parseDocblock } from './getDocblock';

interface EventType {
  names: string[];
}

interface EventProperty {
  type: EventType;
  name?: string;
  description?: string;
}

interface DocBlockTagEvent extends DocBlockTags {
  type?: EventType;
  properties: EventProperty[] | undefined;
}

export default function getEvents(ast: BabelFile) {
  if (Array.isArray(ast.comments)) {
    const eventCommentBlocksDoclets = ast.comments.reduce((acc, comment) => {
      // only observe block comments
      if (!types.CommentBlock.check(comment)) {
        return acc;
      }

      const doc: DocBlockTagEvent = {
        properties: undefined,
        ...getDoclets(parseDocblock(comment.value)),
      };

      // filter comments where a tag is @event
      const eventTag: Tag | undefined = doc.tags.find((t) => t.title === 'event') as Tag;
      if (eventTag) {
        const typeTags = doc.tags.filter((t) => t.title === 'type');

        doc.type = typeTags.length
          ? { names: typeTags.map((t: ParamTag) => t.type.name) }
          : undefined;

        const propertyTags = doc.tags.filter((t) => t.title === 'property');
        if (propertyTags.length) {
          doc.properties = propertyTags.map((t: ParamTag) => {
            return { type: { names: [t.type.name] }, name: t.name, description: t.description };
          });
        }

        // remove the property an type tags from the tag array
        doc.tags = doc.tags.filter(
          (t: Tag | ParamTag) => t.title !== 'type' && t.title !== 'property' && t.title !== 'event',
        );

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
