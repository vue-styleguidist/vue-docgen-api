const DOCLET_PATTERN = /^@(\w+)(?:$|\s((?:[^](?!^@\w))*))/gim;

interface ParamType {
  name: string;
  elements?: ParamType[];
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
}

function getParamInfo(content: string, hasName: boolean) {
  const typeSliceArray = /^\{([^}]+)\}/.exec(content);
  const typeSlice = typeSliceArray && typeSliceArray.length ? typeSliceArray[1] : '*';
  const param: Param = { type: getTypeObjectFromTypeString(typeSlice) };

  content = content.replace(`{${typeSlice}} `, '');

  if (hasName) {
    const nameSliceArray = /^(\w+)( - )?/.exec(content);
    if (nameSliceArray) {
      param.name = nameSliceArray[1];
    }

    if (param.name) {
      content = content.replace(new RegExp(`^${param.name} (- )?`), '');
    }
  }

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

const TYPED_TAG_TITLES = ['param', 'property', 'type', 'returns'];

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
    if (TYPED_TAG_TITLES.indexOf(title) > -1) {
      tags.push({ title, ...getParamInfo(match[2], title !== 'returns') });
    } else {
      tags.push({ title, content: match[2] || true });
    }
  }

  const description = str.replace(DOCLET_PATTERN, '').trim();

  return { description, tags };
}
