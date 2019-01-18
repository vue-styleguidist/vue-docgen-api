import { ParserPlugin } from '@babel/parser'
import babylon from '../../babel-parser'
import { Documentation } from '../../Documentation'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import componentHandler from '../componentHandler'

jest.mock('../../Documentation')

function parse(src: string, plugins: ParserPlugin[] = []) {
  const ast = babylon({ plugins }).parse(src)
  return resolveExportedComponent(ast)
}

describe('componentHandler', () => {
  let documentation: Documentation

  beforeEach(() => {
    documentation = new (require('../../Documentation')).Documentation()
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

  it('should return tags for normal components', () => {
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
      author: [{ description: '[Rafael]', title: 'author' }],
      version: [{ description: '12.5.7', title: 'version' }],
    })
  })

  it('should return tags for class style components', () => {
    const src = `
    /**
     * An empty component
     * @version 12.5.7
     */
    @Component
    export default class myComp {

    }
    `
    const def = parse(src, ['typescript'])
    componentHandler(documentation, def[0])
    expect(documentation.set).toHaveBeenCalledWith('tags', {
      version: [{ description: '12.5.7', title: 'version' }],
    })
  })
})
