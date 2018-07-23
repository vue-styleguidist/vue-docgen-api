export default function(source) {
  try {
    const typescript = require('typescript')
    return typescript.transpileModule(source, {
      compilerOptions: {
        target: 'es2017',
      },
    })
  } catch (err) {
    throw err
  }
}
