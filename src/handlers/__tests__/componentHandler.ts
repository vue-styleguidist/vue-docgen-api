import { NodePath } from 'ast-types';
import componentHandler from '../componentHandler';
import babylon from '../../babel-parser';
import resolveExportedComponent from '../../utils/resolveExportedComponent';
import { Documentation } from '../../Documentation';

jest.mock('../../Documentation');

function parse(src: string) {
  const ast = babylon().parse(src);
  return resolveExportedComponent(ast.program);
}

describe('componentHandler', () => {
  let documentation: Documentation;

  beforeEach(() => {
    documentation = new (require('../../Documentation')).Documentation();
  });

  it('should return the right component name', () => {
    const src = `
    /**
     * An empty component
     */
    export default {
      name: 'name-123',
    }
    `;
    const def = parse(src);
    componentHandler(documentation, def[0]);
    expect(documentation.set).toHaveBeenCalledWith('description', 'An empty component');
  });

  it('should return the right component name', () => {
    const src = `
    /**
     * An empty component
     * @version 12.5.7
     * @author [Rafael]
     */
    export default {
      name: 'name-123',
    }
    `;
    const def = parse(src);
    componentHandler(documentation, def[0]);
    expect(documentation.set).toHaveBeenCalledWith('tags', {
      author: [{ description: '[Rafael]', title: 'author' }],
      version: [{ description: '12.5.7', title: 'version' }],
    });
  });
});
