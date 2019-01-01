import types from 'ast-types'
import componentHandler from '../componentHandler'
import babylon from '../../babel-parser'
import resolveExportedComponent from '../../utils/resolveExportedComponent'

jest.mock('../../Documentation')

function parse(src) {
  var ast = babylon().parse(src)
  return resolveExportedComponent(ast.program, types)
}

describe('componentHandler', () => {
  let documentation

  beforeEach(() => {
    documentation = new (require('../../Documentation'))()
  })

  it('should return the right component name', () => {
    const src = `
    /**
     * An empty component 
     */
    export default {
      name: 'name-123',
    }
    `
    const def = parse(src)
    componentHandler(documentation, def[0])
    expect(documentation.set).toHaveBeenCalledWith('description', 'An empty component')
  })

  it('should return the right component name', () => {
    const src = `
    /**
     * An empty component
     * @version 12.5.7
     * @author [Rafael]
     */
    export default {
      name: 'name-123',
    }
    `
    const def = parse(src)
    componentHandler(documentation, def[0])
    expect(documentation.set).toHaveBeenCalledWith('tags', {
      version: '12.5.7',
      author: '[Rafael]',
    })
  })
})
