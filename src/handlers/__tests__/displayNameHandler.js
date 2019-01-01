import displayNameHandler from '../displayNameHandler'
import babylon from '../../babel-parser'
import resolveExportedComponent from '../../utils/resolveExportedComponent'

jest.mock('../../Documentation')

function parse(src) {
  const ast = babylon().parse(src)
  return resolveExportedComponent(ast.program)
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

  it('should return the right component name as a constant', () => {
    const src = `
    const NAME = 'name-123';
    export default {
      name: NAME,
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
