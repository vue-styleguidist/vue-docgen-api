import recast from 'recast'
import propHandler from '../methodHandler'
import babylon from '../../babylon'
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
    documentation.set.mockImplementation((key, methods) => (mockPropDescriptor[key] = methods))
  })

  function tester(src, matchedObj) {
    const def = parse(src)
    propHandler(documentation, def[0])
    expect(mockPropDescriptor).toMatchObject(matchedObj)
  }

  it('should ignore every method not tagged as @public', () => {
    const src = `
    export default {
      name: 'name-123',
      methods:{
        testIgnore(){
          return 1;
        }
        /**
         * @public
         */
        testPublic() {
          return {};
        }
      }
    }`
    tester(src, {
      methods: [
        {
          name: 'testPublic',
        },
      ],
    })
  })

  it('should return the methods of the component', () => {
    const src = `
    export default {
      name: 'name-123',
      components: {
        testComp: {}
      },
      methods: {
        /**
         * @public
         */
        testFunction: function(){
          return 1;
        },
        /**
         * @public
         */
        testMethod() {
          return {};
        }
      }
    }
    `
    tester(src, {
      methods: [
        {
          name: 'testFunction',
        },
        {
          name: 'testMethod',
        },
      ],
    })
  })

  it('should return their parameters', () => {
    const src = `
    export default {
      name: 'name-123',
      methods: {
        /**
         * @public
         */
        testWithParam(param){
          return 2 * param;
        },
        /**
         * @public
         */
        testWithMultipleParams(param1, param2){
          return param2 + param1;
        }
      }
    }
    `
    tester(src, {
      methods: [
        {
          name: 'testWithParam',
          params: [{ name: 'param' }],
        },
        {
          name: 'testWithMultipleParams',
          params: [{ name: 'param1' }, { name: 'param2' }],
        },
      ],
    })
  })

  it('should allow description of methods', () => {
    const src = `
    export default {
      name: 'name-123',
      methods: {
        /**
         * it returns 2
         * @public
         */
        describedFunc(){
          return 2;
        }
      }
    }
    `
    tester(src, {
      methods: [
        {
          name: 'describedFunc',
          description: 'it returns 2',
        },
      ],
    })
  })

  it('should allow description of params', () => {
    const src = `
    export default {
      name: 'name-123',
      methods: {
        /**
         * @public
         * @param {string} p1 - multiplicateur
         */
        describedParams(p1){
          return p1 * 2;
        }
      }
    }
    `
    tester(src, {
      methods: [
        {
          name: 'describedParams',
          params: [{ name: 'p1', description: 'multiplicateur', type: { name: 'string' } }],
        },
      ],
    })
  })

  it('should allow description of params without naming them', () => {
    const src = `
    export default {
      name: 'name-123',
      methods: {
        /**
         * @public
         * @param {string} - unanmed param
         * @param {number} - another unanmed param
         */
        describedParams(p, p2){
          return p * 2;
        }
      }
    }
    `
    tester(src, {
      methods: [
        {
          name: 'describedParams',
          params: [
            { name: 'p', description: 'unanmed param', type: { name: 'string' } },
            { name: 'p2', description: 'another unanmed param', type: { name: 'number' } },
          ],
        },
      ],
    })
  })
})
