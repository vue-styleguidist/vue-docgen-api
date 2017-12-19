import * as utils from './utils';
import stateDoc from './utils/stateDoc';

export default function(source, path) {
	if (source === '') {
		throw new Error('The document is empty');
	}

	stateDoc.file = path;
	stateDoc.saveComponent(source, path);
	const component = utils.getSandbox(stateDoc.jscodeReqest, path).default;
	const vueDoc = utils.getVueDoc(stateDoc, component);
	return vueDoc;
}
