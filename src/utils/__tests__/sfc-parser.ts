import { CompiledSFC } from 'vue-sfc';
import scfParser from '../sfc-parser';

describe('sfc-parser', () => {
  let compiledSfc: CompiledSFC;
  beforeEach(() => {
    compiledSfc = scfParser(
      `
    <template><div/></template>
    <script>
    export default {}
    </script>
    <style>test{display:block;}</style>
    `,
      'test',
    );
  });

  it('should parse sfc templates', () => {
    expect(compiledSfc.script.content).toContain('export default {}');
  });
});
