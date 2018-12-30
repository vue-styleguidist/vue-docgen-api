import babelParser from '../babel-parser'
describe('babel-parser', () => {
  it('should parse js with no trouble', () => {
    const src = `let bonjour = 'test'`
    expect(() => {
      babelParser().parse(src)
    }).not.toThrow()
  })

  it('should parse jsx with no trouble', () => {
    const src = `let bonjour = (<a>test</a>)`
    expect(() => {
      babelParser().parse(src)
    }).not.toThrow()
  })
  it('should parse complex jsx with no trouble', () => {
    const src = `export default {
        render() {
        const { sortKey, capitalize } = this
        return (
        <table class="grid">
            <thead>
            <tr>
                {columns.map(key => (
                <th onClick={() => sortBy(key)} class={{ active: sortKey == key }}>
                    {capitalize(key)}
                    <span class={'arrow ' + (sortOrders[key] > 0 ? 'asc' : 'dsc')} />
                </th>
                ))}
            </tr>
            </thead>
            <tbody>{filteredData.map(entry => columns.map(key => entry[key]))}</tbody>
        </table>
        )
    }
    }`
    expect(() => {
      babelParser().parse(src)
    }).not.toThrow()
  })
})
