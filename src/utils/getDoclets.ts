const DOCLET_PATTERN = /^@(\w+)(?:$|\s((?:[^](?!^@\w))*))/gim;

interface ParamType {
  name: string;
  elements?: ParamType[];
}

interface EventType {
  names: string[];
}

interface Param {
  type: ParamType;
  name?: string;
  description?: string;
}

interface RootTag {
  title: string;
}

export interface Tag extends RootTag {
  content: string | boolean;
}

export interface ParamTag extends RootTag, Param {}

export interface DocBlockTags {
  description: string;
  tags: Array<ParamTag | Tag>;
  type?: EventType;
}

function getParamInfo(content: string) {
  const typeSliceArray = /^\{([^}]+)\}/.exec(content);
  const typeSlice = typeSliceArray && typeSliceArray.length ? typeSliceArray[1] : '*';
  const param: Param = { type: getTypeObjectFromTypeString(typeSlice) };

  content = content.replace(`{${typeSlice}} `, '');

  const nameSliceArray = /^(\w+) - /.exec(content);
  if (nameSliceArray) {
    param.name = nameSliceArray[1];
  }

  content = content.replace(/^(\w+)? ?(- )?/, '');

  if (content.length) {
    param.description = content;
  }

  return param;
}

function getTypeObjectFromTypeString(typeSlice: string): ParamType {
  if (typeSlice === '' || typeSlice === '*') {
    return { name: 'mixed' };
  } else if (/\w+\|\w+/.test(typeSlice)) {
    return {
      name: 'union',
      elements: typeSlice.split('|').map((type) => getTypeObjectFromTypeString(type)),
    };
  } else {
    return {
      name: typeSlice,
    };
  }
}

/**
 * Given a string, this functions returns an object with
 * two keys:
 * - `tags` an array of tags {title: tagname, content: }
 * - `description` whatever is left once the tags are removed
 */
export default function getDocblockTags(str: string): DocBlockTags {
  const tags: Array<ParamTag | Tag> = [];
  let match = DOCLET_PATTERN.exec(str);

  for (; match; match = DOCLET_PATTERN.exec(str)) {
    const title = match[1];
    if (title === 'param' || title === 'property' || title === 'type') {
      tags.push({ title, ...getParamInfo(match[2]) });
    } else {
      tags.push({ title, content: match[2] || true });
    }
  }

  const description = str.replace(DOCLET_PATTERN, '').trim();

  return { description, tags };
}
