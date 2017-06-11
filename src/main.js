import * as utils from './utils';
import parse from './parse';

function defaultParse(src) {
  return parse(src);
}

export {
	defaultParse as parse,
	utils,
};

