import recast from 'recast'
import displayNameHandler from '../displayNameHandler'
import babylon from '../../utils/babylon'
import resolveExportedComponent from '../../utils/resolveExportedComponent'

jest.mock('../../Documentation')

function parse(src) {
  var ast = recast.parse(src, babylon)
  return resolveExportedComponent(ast.program, recast)
}

describe('methodHandler', () => {
  let documentation

  beforeEach(() => {
    documentation = new (require('../../Documentation'))()
  })

  it('should return the right component name', () => {
    const src = `
    export default {
      name: 'name-123',
      components: {
        testComp: {}
      }
    }
    `
    const def = parse(src)
    displayNameHandler(documentation, def[0])
    expect(documentation.set).toHaveBeenCalledWith('displayName', 'name-123')
  })
})
