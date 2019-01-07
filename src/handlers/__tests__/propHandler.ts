import propHandler from '../propHandler';
import babylon from '../../babel-parser';
import { PropDescriptor, Documentation } from '../../Documentation';
import resolveExportedComponent from '../../utils/resolveExportedComponent';

jest.mock('../../Documentation');

function parse(src: string) {
  const ast = babylon().parse(src);
  return resolveExportedComponent(ast.program);
}

describe('propHandler', () => {
  let documentation: Documentation;
  let mockPropDescriptor: PropDescriptor;

  beforeEach(() => {
    mockPropDescriptor = {
      comment: '',
      description: '',
      required: '',
      tags: {},
    };
    const MockDocumentation = require('../../Documentation').Documentation;
    documentation = new MockDocumentation();
    const mockGetPropDescriptor = documentation.getPropDescriptor as jest.Mock;
    mockGetPropDescriptor.mockReturnValue(mockPropDescriptor);
  });

  function tester(src: string, matchedObj: any) {
    const def = parse(src);
    propHandler(documentation, def[0]);
    expect(mockPropDescriptor).toMatchObject(matchedObj);
  }

  describe('base', () => {
    it('should accept an array of string as props', () => {
      const src = `
        export default {
          props: ['testArray']
        }`;
      tester(src, {
        type: { name: 'undefined' },
      });
      expect(documentation.getPropDescriptor).toHaveBeenCalledWith('testArray');
    });
  });

  describe('type', () => {
    it('should return the right props type', () => {
      const src = `
        export default {
          name: 'name-123',
          components: {
            testComp: {}
          },
          props: {
            test: {
              type: Array
            }
          }
        }
        `;
      tester(src, {
        type: { name: 'array' },
      });
    });

    it('should return the right props composite type', () => {
      const src = `
        export default {
          name: 'name-123',
          components: {
            testComp: {}
          },
          props: {
            test: {
              type: [String, Number]
            }
          }
        }
        `;
      tester(src, {
        type: { name: 'string|number' },
      });
    });

    it('should return the right props type', () => {
      const src = `
        export default {
          name: 'name-123',
          components: {
            testComp: {}
          },
          props: {
            test: Array
          }
        }
        `;
      tester(src, {
        type: { name: 'array' },
      });
    });

    it('should return the right props type string', () => {
      const src = `
        export default {
          props: {
            test: String
          }
        }
        `;
      tester(src, {
        type: { name: 'string' },
      });
    });

    it('should deduce the prop type from the default value', () => {
      const src = `
        export default {
          props: {
            test:{
              default: false
            }
          }
        }
        `;
      tester(src, {
        type: { name: 'boolean' },
      });
    });
  });

  describe('required', () => {
    it('should return the right required props', () => {
      const src = `
        export default {
          name: 'name-123',
          components: {
            testComp: {}
          },
          props: {
            test: {
              required: true
            }
          }
        }
        `;
      tester(src, {
        required: true,
      });
    });
  });

  describe('defaultValue', () => {
    it('should return the right default', () => {
      const src = `
        export default {
          props: {
            test: {
              default: ['hello']
            }
          }
        }
        `;
      tester(src, {
        defaultValue: { value: '["hello"]' },
      });
    });

    it('should be ok with just the default', () => {
      const src = `
        export default {
          props: {
            test: {
              default: 'normal'
            }
          }
        }
        `;
      tester(src, {
        defaultValue: { value: '"normal"' },
      });
    });
  });

  describe('description', () => {
    it('should return the right description', () => {
      const src = `
        export default {
          props: {
            /**
             * test description
             */
            test: {
              required: true
            }
          }
        }
        `;
      tester(src, {
        description: 'test description',
      });
    });
  });

  describe('v-model', () => {
    it('should set the @model property as v-model instead of test', () => {
      const src = `
        export default {
          props: {
            /**
             * test description
             * @model
             */
            test: String
          }
        }
        `;
      tester(src, {
        description: 'test description',
      });
      expect(documentation.getPropDescriptor).not.toHaveBeenCalledWith('test');
      expect(documentation.getPropDescriptor).toHaveBeenCalledWith('v-model');
    });
  });
});
