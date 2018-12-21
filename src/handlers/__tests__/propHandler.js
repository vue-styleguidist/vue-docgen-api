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

  it('should return the right props type', () => {
    const src = `
    export default {
      props: {
        test: {
          type: Array
        }
      }
    }
    `
    const def = parse(src)
    propHandler(documentation, def[0])
    expect(mockPropDescriptor).toMatchObject({
      type: 'Array',
    })
  })

  it('should return the right required props', () => {
    const src = `
    export default {
      props: {
        test: {
          required: true
        }
      }
    }
    `
    const def = parse(src)
    propHandler(documentation, def[0])
    expect(mockPropDescriptor).toMatchObject({
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
    const def = parse(src)
    propHandler(documentation, def[0])
    expect(mockPropDescriptor).toMatchObject({
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
        test: Array
      }
    }
    `
    const def = parse(src)
    propHandler(documentation, def[0])
    expect(mockPropDescriptor).toMatchObject({
      description: 'test description',
    })
  })
})
