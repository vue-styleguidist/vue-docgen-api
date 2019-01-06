const path = require('path')

const api = require('../../../src/main')
const button = path.join(__dirname, './MyButton.vue')
let docButton

describe('tests button with pug', () => {
  beforeEach(function(done) {
    docButton = api.parse(button)
    done()
  })

  it('should have a slot.', () => {
    expect(Object.keys(docButton['slots']).length).toEqual(1)
  })

  it('should have a default slot.', () => {
    expect(docButton['slots']['default']).not.toBeUndefined()
  })

  it('the default slot should have "Use this slot default" as description', () => {
    expect(docButton['slots']['default']['description']).toEqual('Use this slot default')
  })
})
