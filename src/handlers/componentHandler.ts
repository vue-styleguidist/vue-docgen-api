import { NodePath } from 'ast-types';
import transformTagsIntoObject from '../utils/transformTagsIntoObject';
import getDoclets from '../utils/getDoclets';
import getDocblock from '../utils/getDocblock';
import { Documentation } from '../Documentation';
import { isCallExpression } from '@babel/types';

export default function propHandler(documentation: Documentation, path: NodePath) {
  let componentCommentedPath = path.parent;
  // in case of Vue.extend() structure
  if (isCallExpression(componentCommentedPath.node)) {
    componentCommentedPath = componentCommentedPath.parent;
  }
  const docBlock = getDocblock(componentCommentedPath);

  // if no prop return
  if (!docBlock || !docBlock.length) {
    return;
  }

  const jsDoc = getDoclets(docBlock);

  documentation.set('description', jsDoc.description || '');

  documentation.set('tags', transformTagsIntoObject(jsDoc.tags || []));
}
