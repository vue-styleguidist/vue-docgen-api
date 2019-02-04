import adaptRequireWithIEV from '../adaptExportsToIEV'
import { ImportedVariableSet } from '../resolveRequired'

describe('adaptRequireWithIEV', () => {
  let set: ImportedVariableSet
  beforeEach(() => {
    set = {}
  })
  it('should immediately exported varibles', () => {
    adaptRequireWithIEV(() => '', set)
    expect(set).toBe(false)
  })
})
