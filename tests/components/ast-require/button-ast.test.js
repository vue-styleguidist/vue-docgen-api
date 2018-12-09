const path = require('path')

const api = require('../../../src/main')
const buttonBar = path.join(__dirname, './ButtonBar.vue')
let docButton

describe('tests button', () => {
  beforeAll(function(done) {
    docButton = api.parse(buttonBar)
    done()
  })
  
  it('should use the name in other file as the default', function(){
    expect(docButton['props']['listofButtonNames']['defaultValue']['value']).toEqual('"normal"')
  })
})
