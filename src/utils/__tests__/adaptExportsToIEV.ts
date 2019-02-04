import adaptRequireWithIEV from '../adaptExportsToIEV'
import { ImportedVariableSet } from '../resolveRequired'

jest.mock('../resolveImmediatelyExported')
jest.mock('../resolveRequired')

describe('adaptRequireWithIEV', () => {
  let set: ImportedVariableSet
  let mockResolver: jest.Mock
  beforeEach(() => {
    set = { test: { filePath: 'my/path', exportName: 'exportIt' } }
    mockResolver = jest.fn()
  })

  it('should immediately exported varibles', () => {
    adaptRequireWithIEV(mockResolver, set)
    expect(mockResolver).toHaveBeenCalledWith('my/path')
  })
})
