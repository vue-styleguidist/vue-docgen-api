var getVueDoc = require('../../../dist/utils/getVueDoc').default
const expect = require('chai').expect

describe('getVueDoc', () => {
  it('should return right comment for longname default', () => {
    const result = getVueDoc({
      file: '',
      getDocJs: () => [
        {
          description: 'Component description',
          longname: 'default'
        },
        {
          description: 'Prop description',
          longname: 'default.props.prop'
        }
      ]
    }, {})
    expect(result.description).to.equal('Component description')
  })

  it('should return right comment for longname _default', () => {
    const result = getVueDoc({
      file: '',
      getDocJs: () => [
        {
          description: 'Component description',
          longname: '_default'
        },
        {
          description: 'Prop description',
          longname: '_default.props.prop'
        }
      ]
    }, {})
    expect(result.description).to.equal('Component description')
  })

  it('should return right comment for longname default2', () => {
    const result = getVueDoc({
      file: '',
      getDocJs: () => [
        {
          description: 'Component description',
          longname: 'default2'
        },
        {
          description: 'Prop description',
          longname: 'default2.props.prop'
        }
      ]
    }, {})
    expect(result.description).to.equal('Component description')
  })

  it('should return right comment for longname _default2', () => {
    const result = getVueDoc({
      file: '',
      getDocJs: () => [
        {
          description: 'Component description',
          longname: '_default2'
        },
        {
          description: 'Prop description',
          longname: '_default2.props.prop'
        }
      ]
    }, {})
    expect(result.description).to.equal('Component description')
  })
})
