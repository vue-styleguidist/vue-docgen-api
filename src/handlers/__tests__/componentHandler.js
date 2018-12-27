import recast from 'recast'
import componentHandler from '../componentHandler'
import babylon from '../../babylon'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import { version } from 'core-js'

jest.mock('../../Documentation')

function parse(src) {
  var ast = recast.parse(src, babylon)
  return resolveExportedComponent(ast.program, recast)
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
