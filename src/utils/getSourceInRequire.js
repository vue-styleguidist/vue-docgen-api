import path from 'path'
import getRequires from './getRequires'

export default function getSourceInRequire(code, file) {
  try {
    const requiresFromComponent = getRequires(code)
    let output = []
    Object.keys(requiresFromComponent).forEach(reqFromComponent => {
      const tempRequire = reqFromComponent.split('/')
      if (tempRequire[0] === '.' || tempRequire[0] === '..') {
        const folderFile = path.dirname(file)
        output.push(path.join(path.normalize(folderFile), reqFromComponent))
      }
    })
    return output
  } catch (err) {
    throw err
  }
}
