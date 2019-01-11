import babylon from '../../babel-parser'
import { Documentation, PropDescriptor } from '../../Documentation'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import classPropHandler from '../classPropHandler'

jest.mock('../../Documentation')

function parse(src: string) {
  const ast = babylon().parse(src)
  return resolveExportedComponent(ast.program)
}

describe('propHandler', () => {
  let documentation: Documentation
  let mockPropDescriptor: PropDescriptor

  beforeEach(() => {
    mockPropDescriptor = {
      description: '',
      required: '',
      tags: {},
    }
    const MockDocumentation = require('../../Documentation').Documentation
    documentation = new MockDocumentation()
    const mockGetPropDescriptor = documentation.getPropDescriptor as jest.Mock
    mockGetPropDescriptor.mockReturnValue(mockPropDescriptor)
  })

  function tester(src: string, matchedObj: any) {
    const def = parse(src)
    classPropHandler(documentation, def[0])
    expect(mockPropDescriptor).toMatchObject(matchedObj)
  }

  xdescribe('base', () => {
    it('should accept an array of string as props', () => {
      const src = `
        @Component
        export default class MyTest {
          @Prop
          test: string
        }`
      tester(src, {
        type: { name: 'string' },
      })
      expect(documentation.getPropDescriptor).toHaveBeenCalledWith('test')
    })
  })
})
