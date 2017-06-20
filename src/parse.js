import fs from 'fs';
import * as utils from './utils';
import stateDoc from './utils/stateDoc';

export default function parse(file, webpackConfig) {
	const source = fs.readFileSync(file, { encoding: 'utf-8' });
	if (source === '') {
		throw new Error('The document is empty');
	}
	stateDoc.file = file;
	const component = utils.getComponent(source, file, webpackConfig);
	const vueDoc = utils.getVueDoc(stateDoc.getDoc(), component);
	return vueDoc;
}
