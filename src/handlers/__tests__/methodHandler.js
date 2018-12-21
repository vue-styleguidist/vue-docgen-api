import recast from 'recast'
import propHandler from '../methodHandler'
import babylon from '../../utils/babylon'
import resolveExportedComponent from '../../utils/resolveExportedComponent'

jest.mock('../../Documentation')

function parse(src) {
  var ast = recast.parse(src, babylon)
  return resolveExportedComponent(ast.program, recast)
}

describe('methodHandler', () => {
  let documentation
  let mockPropDescriptor

  beforeEach(() => {
    mockPropDescriptor = {}
    documentation = new (require('../../Documentation'))()
    documentation.getPropDescriptor.mockReturnValue(mockPropDescriptor)
  })

  function test(src, matchedObj) {
    const def = parse(src)
    propHandler(documentation, def[0])
    expect(mockPropDescriptor).toMatchObject(matchedObj)
  }

  it('should return the right props type', () => {
    const src = `
    export default {
      name: 'name-123',
      components: {
        testComp: {}
      },
      methods: {
        test() {
          return {};
        }
      }
    }
    `
    test(src, {
      methods: 'Array',
    })
  })
})
