import fs from 'fs';
import * as utils from './utils';

export default function parse(file) {
	const source = fs.readFileSync(file, { encoding: 'utf-8' });
	if (source === '') {
		throw new Error('The document is empty');
	}
	const jscodeReqest = utils.getComponentModuleJSCode(source, file);
	const component = utils.getSandbox(jscodeReqest, file).default;
	const doc = utils.getDocFile(jscodeReqest, file);
	const vueDoc = utils.getVueDoc(doc, component);
	return vueDoc;
}
