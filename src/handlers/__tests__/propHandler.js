import recast from 'recast'
import propHandler from '../propHandler'
import babylon from '../../babylon'
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

  function tester(src, matchedObj) {
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
    tester(src, {
      type: 'Array',
    })
  })

  it('should return the right props type', () => {
    const src = `
    export default {
      name: 'name-123',
      components: {
        testComp: {}
      },
      props: {
        test: Array
      }
    }
    `
    tester(src, {
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
    tester(src, {
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
    tester(src, {
      defaultValue: { value: "['hello']" },
    })
  })

  it('should be ok with just the default', () => {
    const src = `
    export default {
      props: {
        test: {
          default: 'normal'
        }
      }
    }
    `
    tester(src, {
      defaultValue: { value: "'normal'" },
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
    tester(src, {
      description: 'test description',
    })
  })
})
