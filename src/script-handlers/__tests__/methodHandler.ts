import babylon from '../../babel-parser'
import { Documentation, MethodDescriptor } from '../../Documentation'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import propHandler from '../methodHandler'

jest.mock('../../Documentation')

function parse(src: string) {
  const ast = babylon({ plugins: ['flow'] }).parse(src)
  return resolveExportedComponent(ast)
}

function parseTS(src: string) {
  const ast = babylon({ plugins: ['typescript'] }).parse(src)
  return resolveExportedComponent(ast)
}

describe('methodHandler', () => {
  let documentation: Documentation
  let mockMethodDescriptor: MethodDescriptor

  beforeEach(() => {
    mockMethodDescriptor = { name: '', description: '', modifiers: [] }
    const MockDocumentation = require('../../Documentation').Documentation
    documentation = new MockDocumentation()
    const mockGetMethodDescriptor = documentation.getMethodDescriptor as jest.Mock
    mockGetMethodDescriptor.mockImplementation((name: string) => {
      mockMethodDescriptor.name = name
      return mockMethodDescriptor
    })
  })

  function tester(src: string, matchedObj: any) {
    const def = parse(src)
    propHandler(documentation, def[0])
    expect(mockMethodDescriptor).toMatchObject(matchedObj)
  }

  it('should ignore every method not tagged as @public', () => {
    const src = `
    export default {
      name: 'name-123',
      methods:{
        testIgnore(){
          return 1;
        },
        /**
         * @public
         */
        testPublic() {
          return {};
        }
      }
    }`
    tester(src, {
      name: 'testPublic',
    })
  })
  describe('formats', () => {
    it('should return the method if it is an anonymous function', () => {
      const src = `
    export default {
      methods: {
        /**
         * @public
         */
        testFunction: function(){
          return 1;
        }
      }
    }
    `
      tester(src, {
        name: 'testFunction',
      })
    })

    it('should return the method if it is an object method', () => {
      const src = `
        export default {
          methods: {
            /**
             * @public
             */
            testMethod(){
              return 1;
            }
          }
        }
        `
      tester(src, {
        name: 'testMethod',
      })
    })

    it('should return the method if it is an arrow function', () => {
      const src = `
      export default {
        methods: {
          /**
           * @public
           */
          testArrowFunction: () => {
            return 'test';
          },
        }
      }
      `
      tester(src, {
        name: 'testArrowFunction',
      })
    })
  })

  it('should return their parameters', () => {
    const src = `
    export default {
      methods: {
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
      name: 'testWithMultipleParams',
      params: [{ name: 'param1' }, { name: 'param2' }],
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
      name: 'describedFunc',
      description: 'it returns 2',
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
      name: 'describedParams',
      params: [{ name: 'p1', description: 'multiplicateur', type: { name: 'string' } }],
    })
  })

  it('should allow description of params even if they are implicit', () => {
    const src = `
    export default {
      name: 'name-123',
      methods: {
        /**
         * @public
         * @param {string} - unnamed param
         * @param {number} - another unnamed param
         */
        describedParams(){
          return arguments;
        }
      }
    }
    `
    tester(src, {
      name: 'describedParams',
      params: [
        { description: 'unnamed param', type: { name: 'string' } },
        { description: 'another unnamed param', type: { name: 'number' } },
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
         * @param {string} - unnamed param
         * @param {number} - another unnamed param
         */
        describedParams(p, p2){
          return p * 2;
        }
      }
    }
    `
    tester(src, {
      name: 'describedParams',
      params: [
        { name: 'p', description: 'unnamed param', type: { name: 'string' } },
        { name: 'p2', description: 'another unnamed param', type: { name: 'number' } },
      ],
    })
  })

  describe('flow', () => {
    it('should deduce the type of params from the param type', () => {
      const src = [
        '/* @flow */',
        'export default {',
        '  methods:{',
        '    /**',
        '     * @public',
        '     */',
        '    publicMethod(param: string, paramObscure: ObscureInterface) {',
        '      console.log("test", paramObscure)',
        '    }',
        '  }',
        '}',
      ].join('\n')

      const def = parse(src)
      propHandler(documentation, def[0])
      expect(mockMethodDescriptor).toMatchObject({
        name: 'publicMethod',
        params: [
          { name: 'param', type: { name: 'string' } },
          { name: 'paramObscure', type: { name: 'ObscureInterface' } },
        ],
      })
    })

    it('should deduce the return type from method', () => {
      const src = [
        '/* @flow */',
        'export default {',
        '  methods:{',
        '    /**',
        '     * @public',
        '     */',
        '    publicMethod(): string {',
        '      console.log("test")',
        '    }',
        '  }',
        '}',
      ].join('\n')

      const def = parse(src)
      propHandler(documentation, def[0])
      expect(mockMethodDescriptor).toMatchObject({
        name: 'publicMethod',
        returns: { type: { name: 'string' } },
      })
    })
  })

  describe('typescript', () => {
    it('should deduce the type of params from the param type', () => {
      const src = `
      export default {
        methods:{
          /**
           * @public
           */
          publicMethod(param: string, paramObscure: ObscureInterface) {
            console.log('test', test, param)
          }
        }
      }
      `

      const def = parseTS(src)
      propHandler(documentation, def[0])
      expect(mockMethodDescriptor).toMatchObject({
        name: 'publicMethod',
        params: [
          { name: 'param', type: { name: 'string' } },
          { name: 'paramObscure', type: { name: 'ObscureInterface' } },
        ],
      })
    })

    it('should deduce the return type from method decoration', () => {
      const src = `
      export default {
        methods: {
          /**
           * @public
           */
          twoMethod: (): number => {
            return 2;
          }
        }
      };
      `

      const def = parseTS(src)
      propHandler(documentation, def[0])
      expect(mockMethodDescriptor).toMatchObject({
        name: 'twoMethod',
        returns: { type: { name: 'number' } },
      })
    })
  })
})
