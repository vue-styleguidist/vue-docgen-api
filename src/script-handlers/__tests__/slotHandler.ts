import { NodePath } from 'ast-types'
import babylon from '../../babel-parser'
import { Documentation, SlotDescriptor } from '../../Documentation'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import slotHandler from '../slotHandler'

jest.mock('../../Documentation')

function parse(src: string): NodePath | undefined {
  const ast = babylon().parse(src)
  return resolveExportedComponent(ast).get('default')
}

describe('render function slotHandler', () => {
  let documentation: Documentation
  let mockSlotDescriptor: SlotDescriptor

  beforeEach(() => {
    mockSlotDescriptor = { description: '' }
    documentation = new (require('../../Documentation')).Documentation()
    const mockGetSlotDescriptor = documentation.getSlotDescriptor as jest.Mock
    mockGetSlotDescriptor.mockReturnValue(mockSlotDescriptor)
  })

  it('should find slots in render function', () => {
    const src = `
    export default {
      render: function (createElement) {
        return createElement('div', this.$slots.mySlot)
      }
    }
    `
    const def = parse(src)
    if (def) {
      slotHandler(documentation, def)
    }
    expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('mySlot')
  })

  it('should find scoped slots in render function', () => {
    const src = `
    export default {
      render: function (createElement) {
        return createElement('div', [
          this.$scopedSlots.myScopedSlot({
            text: this.message
          })
        ])
      }
    }
    `
    const def = parse(src)
    if (def) {
      slotHandler(documentation, def)
    }
    expect(documentation.getSlotDescriptor).toHaveBeenCalledWith('myScopedSlot')
  })
})
