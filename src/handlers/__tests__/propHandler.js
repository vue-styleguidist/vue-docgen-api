import recast from 'recast'
import propHandler from '../propHandler'
import babylon from '../../utils/babylon'
import resolveExportedComponent from '../../utils/resolveExportedComponent'

jest.mock('../../Documentation')

function parse(src) {
  var ast = recast.parse(src, babylon)
  return resolveExportedComponent(ast.program, recast)
}

describe('propHandler', () => {
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
      props: {
        test: {
          type: Array
        }
      }
    }
    `
    test(src, {
      type: 'Array',
    })
  })

  it('should return the right required props', () => {
    const src = `
    export default {
      name: 'name-123',
      components: {
        testComp: {}
      },
      props: {
        test: {
          required: true
        }
      }
    }
    `
    test(src, {
      required: true,
    })
  })

  it('should return the right default', () => {
    const src = `
    export default {
      props: {
        test: {
          default: ['hello']
        }
      }
    }
    `
    test(src, {
      defaultValue: "['hello']",
    })
  })

  it('should return the right description', () => {
    const src = `
    export default {
      props: {
        /**
         * test description
         */
        test: {
          required: true
        }
      }
    }
    `
    test(src, {
      description: 'test description',
    })
  })
})
