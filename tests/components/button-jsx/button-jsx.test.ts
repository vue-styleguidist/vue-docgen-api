import * as path from 'path'

import { ComponentDoc } from '../../../src/Documentation'
import { parse } from '../../../src/main'
const button = path.join(__dirname, './Button.jsx')
let docButton: ComponentDoc

describe('tests button', () => {
  beforeAll(done => {
    docButton = parse(button)
    done()
  })

  it('should return an object', () => {
    expect(typeof docButton).toEqual('object')
  })

  it('The component name should be buttonComponent', () => {
    expect(docButton.displayName).toEqual('buttonComponent')
  })

  it('The component should have a description', () => {
    expect(docButton.description).toEqual(
      'This is an example of creating a reusable button component and using it with external data.',
    )
  })

  it('should the component has two tags', () => {
    expect(Object.keys(docButton.tags).length).toEqual(2)
  })

  it('should the component has authors', () => {
    expect(docButton.tags.author).not.toBeUndefined()
  })

  it('should not see the method without tag @public', () => {
    expect(docButton.methods.length).toEqual(0)
  })

  it('should have props', () => {
    expect(docButton.props).not.toBeUndefined()
  })

  it('should the component has version', () => {
    expect(docButton.tags.version).not.toBeUndefined()
  })

  it('should match the snapshot', () => {
    expect(docButton).toMatchSnapshot()
  })
})
