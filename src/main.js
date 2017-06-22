import * as utils from './utils';
import parse from './parse';
import parseWebpack from './parseWebpack';

function defaultParse(src, webpackConfig) {
  return parse(src);
}

function defaultParseWebpack(src) {
  return parseWebpack(src);
}

export {
	defaultParse as parse,
	defaultParseWebpack as parseWebpack,
	utils,
};

