import { File as BabelFile } from '@babel/types';
import { namedTypes as types } from 'ast-types';
import getDoclets, { Tag, ParamTag } from './getDoclets';
import { parseDocblock } from './getDocblock';

export default function getEvents(ast: BabelFile) {
  if (Array.isArray(ast.comments)) {
    const eventCommentBlocksDoclets = ast.comments.reduce((acc, comment) => {
      // only observe block comments
      if (!types.CommentBlock.check(comment)) {
        return acc;
      }

      const doc = getDoclets(parseDocblock(comment.value));

      // filter comments where a tag is @event
      const eventTag: Tag | undefined = doc.tags.find((t) => t.title === 'event') as Tag;
      if (eventTag) {
        const typeTags = doc.tags.filter((t) => t.title === 'type');
        if (typeTags.length) {
          doc.type = { names: typeTags.map((t: ParamTag) => t.type.name) };
        }
        if (typeof eventTag.content === 'string') {
          acc[eventTag.content] = doc;
        }
      }
      return acc;
    }, {});
    // make objects for it
    return eventCommentBlocksDoclets;
  } else {
    return [];
  }
}
