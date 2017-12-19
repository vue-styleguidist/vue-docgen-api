import fs from 'fs';
import * as utils from './utils';
import stateDoc from './utils/stateDoc';

export default function(file) {
	const source = fs.readFileSync(file, { encoding: 'utf-8' });
	if (source === '') {
		throw new Error('The document is empty');
	}
	stateDoc.file = file;
	stateDoc.saveComponent(source, file);
	const component = utils.getSandbox(stateDoc.jscodeReqest, file).default;
	const vueDoc = utils.getVueDoc(stateDoc, component);
	return vueDoc;
}
