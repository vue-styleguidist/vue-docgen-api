import babylon from '../../babel-parser'
import { Documentation, MethodDescriptor } from '../../Documentation'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import classMethodHandler from '../classMethodHandler'

jest.mock('../../Documentation')

function parseTS(src: string) {
  const ast = babylon({ plugins: ['typescript'] }).parse(src)
  return resolveExportedComponent(ast)
}

describe('classPropHandler', () => {
  let documentation: Documentation
  let mockMethodDescriptor: MethodDescriptor

  beforeEach(() => {
    mockMethodDescriptor = { name: '', description: '', modifiers: [] }
    const MockDocumentation = require('../../Documentation').Documentation
    documentation = new MockDocumentation()
    const mockSetMethodDescriptor = documentation.set as jest.Mock
    mockSetMethodDescriptor.mockImplementation(
      (key, methods) => (mockMethodDescriptor[key] = methods),
    )
  })

  function tester(src: string, matchedObj: any) {
    const def = parseTS(src)
    classMethodHandler(documentation, def[0])
    expect(mockMethodDescriptor).toMatchObject(matchedObj)
  }

  it('should detect public methods', () => {
    const src = `
        @Component
        export default class MyComp {
          /**
           * @public
           */
          myMethod(){

          }
        }`
    tester(src, {
      methods: [{ name: 'myMethod' }],
    })
  })

  it('should detect public methods params', () => {
    const src = `
        @Component
        export default class MyComp {
          /**
           * @public
           */
          myMethod(param1){

          }
        }`
    tester(src, {
      methods: [{ name: 'myMethod', params: [{ name: 'param1' }] }],
    })
  })

  it('should detect public methods params types', () => {
    const src = `
        @Component
        export default class MyComp {
          /**
           * @public
           */
          myMethod(param1: string){

          }
        }`
    tester(src, {
      methods: [{ name: 'myMethod', params: [{ name: 'param1', type: { name: 'string' } }] }],
    })
  })

  it('should detect public methods params types', () => {
    const src = `
        @Component
        export default class MyComp {
          /**
           * @public
           */
          myMethod(): number{
            return 1;
          }
        }`
    tester(src, {
      methods: [{ name: 'myMethod', returns: { type: { name: 'number' } } }],
    })
  })
})
