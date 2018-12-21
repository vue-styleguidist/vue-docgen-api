const babel = require('@babel/core')
const presetEnv = require('@babel/preset-env');
const pluginObjectRestSpread = require('@babel/plugin-proposal-object-rest-spread');
const pluginTransformVueJsx = require('babel-plugin-transform-vue-jsx');
const path = require('path')
const process = require('process')

module.exports = function getJsxBabel(code, filename, comments = false) {
  // Provide filename and cwd to babel for:
  //  a) Proper loading of .babelrc
  //  b) Error messages saying where any SyntaxErrors are
  const cwd = process.cwd()
  const filenameRelative = path.relative(cwd, filename)

  const options = {
    ast: false,
    comments,
    filename,
    filenameRelative,
    presets: [
      [
        presetEnv,
        {
          targets: {
            chrome: 52,
          },
        },
      ],
    ],
    plugins: [pluginObjectRestSpread, pluginTransformVueJsx],
    sourceRoot: cwd,
  }

  return babel.transform(code, options)
}
