import { SFCDescriptor } from 'vue-template-compiler'
import scfParser from '../sfc-parser'

describe('sfc-parser', () => {
  let compiledSfc: SFCDescriptor
  beforeEach(() => {
    compiledSfc = scfParser(
      `
    <template lang="pug"><div/></template>
    <script lang="ts">
    export default {}
    </script>
    <style lang="scss">.test{display:block;}</style>
    `,
      'test',
    )
  })

  it('should parse sfc templates', () => {
    expect(compiledSfc).toMatchSnapshot()
  })
})
