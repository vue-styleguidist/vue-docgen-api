import parser from './parser';
import path from 'path';
import fs from 'fs';

const readSeparateScriptFile = (fileName) => {
	return fs.readFileSync(fileName, { encoding: 'utf-8' });
};

export default function getComponentModuleJSCode (source, file){
	const parts = parser(source, 'name');
	if (!parts.script) {
		return source;
		// No script code;
	} else if (parts.script.src) {
		const jsFilePath = path.join(path.dirname(file), parts.script.src);
		return readSeparateScriptFile(jsFilePath);
	} else {
		return parts.script.content;
	}
};
