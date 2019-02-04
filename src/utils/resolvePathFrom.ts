export default function resolvePathFrom(path: string, from: string): string {
  let finalPath = ''
  try {
    finalPath = require.resolve(path, {
      paths: [from],
    })
  } catch (e) {
    try {
      finalPath = require.resolve(`${path}.vue`, {
        paths: [from],
      })
    } catch (e) {
      throw new Error(`Neither '${path}.vue' nor '${path}.js' could be found in '${from}'`)
    }
  }

  return finalPath
}
