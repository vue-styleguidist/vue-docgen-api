import babylon from '../../babel-parser'
import { Documentation, MethodDescriptor } from '../../Documentation'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import classPropHandler from '../classPropHandler'

jest.mock('../../Documentation')

function parseTS(src: string) {
  const ast = babylon({ plugins: ['typescript'] }).parse(src)
  return resolveExportedComponent(ast.program)
}

describe('classPropHandler', () => {
  let documentation: Documentation
  let mockMethodDescriptor: MethodDescriptor

  beforeEach(() => {
    mockMethodDescriptor = { name: '', description: '' }
    const MockDocumentation = require('../../Documentation').Documentation
    documentation = new MockDocumentation()
    const mockSetMethodDescriptor = documentation.set as jest.Mock
    mockSetMethodDescriptor.mockImplementation(
      (key, methods) => (mockMethodDescriptor[key] = methods),
    )
  })

  function tester(src: string, matchedObj: any) {
    const def = parseTS(src)
    classPropHandler(documentation, def[0])
    expect(mockMethodDescriptor).toMatchObject(matchedObj)
  }

  xdescribe('base', () => {
    it('should accept an array of string as props', () => {
      const src = `
        @Component
        export default class MyComp {
          myMethod(){

          }
        }`
      tester(src, {
        type: { name: 'undefined' },
      })
      expect(documentation.getPropDescriptor).toHaveBeenCalledWith('testArray')
    })
  })
})
