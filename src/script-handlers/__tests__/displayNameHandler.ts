import babylon from '../../babel-parser';
import { Documentation } from '../../Documentation';
import resolveExportedComponent from '../../utils/resolveExportedComponent';
import displayNameHandler from '../displayNameHandler';

jest.mock('../../Documentation');

function parse(src: string) {
  const ast = babylon().parse(src);
  return resolveExportedComponent(ast.program);
}

describe('methodHandler', () => {
  let documentation: Documentation;

  beforeEach(() => {
    documentation = new (require('../../Documentation')).Documentation();
  });

  it('should return the right component name', () => {
    const src = `
    export default {
      name: 'name-123',
      components: {
        testComp: {}
      }
    }
    `;
    const def = parse(src);
    displayNameHandler(documentation, def[0]);
    expect(documentation.set).toHaveBeenCalledWith('displayName', 'name-123');
  });

  it('should return the right component name as a constant', () => {
    const src = `
    const NAME = 'name-123';
    export default {
      name: NAME,
      components: {
        testComp: {}
      }
    }
    `;
    const def = parse(src);
    displayNameHandler(documentation, def[0]);
    expect(documentation.set).toHaveBeenCalledWith('displayName', 'name-123');
  });
});
