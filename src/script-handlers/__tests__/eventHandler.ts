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

describe('displayNameHandler', () => {
  let documentation: Documentation

  beforeEach(() => {
    documentation = new (require('../../Documentation')).Documentation()
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
    const eventComp: { [eventName: string]: EventDescriptor } = {
      success: {
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
      },
    }
    expect(documentation.set).toHaveBeenCalledWith('events', eventComp)
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
    const eventComp: { [eventName: string]: EventDescriptor } = {
      success: {
        description: '',
        properties: [
          {
            name: '<anonymous>',
            type: {
              names: ['undefined'],
            },
          },
          {
            name: '<anonymous>',
            type: {
              names: ['undefined'],
            },
          },
        ],
      },
    }
    expect(documentation.set).toHaveBeenCalledWith('events', eventComp)
  })
})
