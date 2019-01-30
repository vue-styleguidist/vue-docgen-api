import * as path from 'path'

import { ComponentDoc, PropDescriptor } from '../../../src/Documentation'
import { parse } from '../../../src/main'
const button = path.join(__dirname, './Button.vue')
let docButton: ComponentDoc

describe('tests button', () => {
  beforeAll(done => {
    docButton = parse(button, {
      '@mixins': path.resolve(__dirname, '../../mixins'),
    })
    done()
  })

  describe('props', () => {
    let props: { [propName: string]: PropDescriptor }

    beforeAll(() => {
      props = docButton.props ? docButton.props : {}
    })

    it('should the component has color prop description equal The color for the button example', () => {
      expect(props.color.description).toEqual('Another Mixins Error')
    })
  })
})
