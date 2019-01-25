import { NodePath } from 'ast-types'
import babylon from '../../babel-parser'
import { Documentation, EventDescriptor } from '../../Documentation'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import eventHandler from '../eventHandler'

jest.mock('../../Documentation')

function parse(src: string): NodePath[] {
  const ast = babylon().parse(src)
  return resolveExportedComponent(ast)
}

describe('eventHandler', () => {
  let documentation: Documentation
  let mockEventDescriptor: EventDescriptor

  beforeEach(() => {
    mockEventDescriptor = { description: '', properties: [] }
    documentation = new (require('../../Documentation')).Documentation()
    const mockGetEventDescriptor = documentation.getEventDescriptor as jest.Mock
    mockGetEventDescriptor.mockReturnValue(mockEventDescriptor)
  })

  it('should find events emmitted', () => {
    const src = `
    export default {
      methods: {
        testEmit() {
            /**
             * Describe the event
             * @property {number} prop1
             * @property {number} prop2
             */
            this.$emit('success', 1, 2)
        }
      }
    }
    `
    const def = parse(src)
    eventHandler(documentation, def[0])
    const eventComp: EventDescriptor = {
      description: 'Describe the event',
      properties: [
        {
          name: 'prop1',
          type: {
            names: ['number'],
          },
        },
        {
          name: 'prop2',
          type: {
            names: ['number'],
          },
        },
      ],
    }
    expect(documentation.getEventDescriptor).toHaveBeenCalledWith('success')
    expect(mockEventDescriptor).toMatchObject(eventComp)
  })

  it('should find events undocumented properties', () => {
    const src = `
    export default {
      methods: {
        testEmit() {
            this.$emit('success', 1, 2)
        }
      }
    }
    `
    const def = parse(src)
    eventHandler(documentation, def[0])
    const eventComp: EventDescriptor = {
      description: '',
      type: {
        names: ['undefined'],
      },
      properties: [
        {
          name: '<anonymous1>',
          type: {
            names: ['undefined'],
          },
        },
      ],
    }
    expect(documentation.getEventDescriptor).toHaveBeenCalledWith('success')
    expect(mockEventDescriptor).toMatchObject(eventComp)
  })
})
