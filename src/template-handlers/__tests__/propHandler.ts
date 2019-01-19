import { compile } from 'vue-template-compiler'
import { ComponentDoc } from '../../Documentation'
import { traverse } from '../../parse-template'
import propHandler from '../propHandler'

describe('slotHandler', () => {
  let doc: ComponentDoc
  beforeEach(() => {
    doc = {
      displayName: '',
      description: '',
      methods: [],
      props: undefined,
      slots: {},
      tags: {},
    }
  })

  it('should match props in attributes expressions', () => {
    const ast = compile(
      [
        '<div>',
        '  <h1>titleof the template</h1>',
        '  <button :style="`width:${props.size}`"></button>',
        '</div>',
      ].join('\n'),
      { comments: true },
    ).ast
    if (ast) {
      traverse(ast, doc, [propHandler], { functional: true })
      expect(doc.props).toMatchObject({ size: { type: { name: 'string' } } })
    } else {
      fail()
    }
  })

  it('should match props in interpolated text', () => {
    const ast = compile(
      [
        '<div>',
        '  <h1>titleof the template</h1>',
        '  <button style="width:200px">',
        '    test {{props.name}}',
        '  </button>',
        '</div>',
      ].join('\n'),
      { comments: true },
    ).ast
    if (ast) {
      traverse(ast, doc, [propHandler], { functional: true })
      expect(doc.props).toMatchObject({ name: { type: { name: 'string' } } })
    } else {
      fail()
    }
  })

  it('should not match props if in a litteral', () => {
    const ast = compile(
      [
        '<div>',
        '  <h1>titleof the template</h1>',
        '  <button :style="`width:props.size`"></slot>',
        '</div>',
      ].join('\n'),
      { comments: true },
    ).ast
    if (ast) {
      traverse(ast, doc, [propHandler], { functional: true })
      expect(doc.props).toBeUndefined()
    } else {
      fail()
    }
  })
})
