import propHandler, { MethodDescriptor } from '../methodHandler';
import babylon from '../../babel-parser';
import resolveExportedComponent from '../../utils/resolveExportedComponent';
import { Documentation } from '../../Documentation';

jest.mock('../../Documentation');

function parse(src) {
  const ast = babylon().parse(src);
  return resolveExportedComponent(ast.program);
}

describe('methodHandler', () => {
  let documentation: Documentation;
  let mockMethodDescriptor: MethodDescriptor;

  beforeEach(() => {
    mockMethodDescriptor = { name: '', description: '' };
    const MockDocumentation = require('../../Documentation');
    documentation = new MockDocumentation();
    const mockSetMethodDescriptor = documentation.set as jest.Mock;
    mockSetMethodDescriptor.mockImplementation(
      (key, methods) => (mockMethodDescriptor[key] = methods),
    );
  });

  function tester(src, matchedObj) {
    const def = parse(src);
    propHandler(documentation, def[0]);
    expect(mockMethodDescriptor).toMatchObject(matchedObj);
  }

  it('should ignore every method not tagged as @public', () => {
    const src = `
    export default {
      name: 'name-123',
      methods:{
        testIgnore(){
          return 1;
        },
        /**
         * @public
         */
        testPublic() {
          return {};
        }
      }
    }`;
    tester(src, {
      methods: [
        {
          name: 'testPublic',
        },
      ],
    });
  });

  it('should return the methods of the component', () => {
    const src = `
    export default {
      name: 'name-123',
      components: {
        testComp: {}
      },
      methods: {
        /**
         * @public
         */
        testFunction: function(){
          return 1;
        },
        /**
         * @public
         */
        testMethod() {
          return {};
        }
      }
    }
    `;
    tester(src, {
      methods: [
        {
          name: 'testFunction',
        },
        {
          name: 'testMethod',
        },
      ],
    });
  });

  it('should return their parameters', () => {
    const src = `
    export default {
      name: 'name-123',
      methods: {
        /**
         * @public
         */
        testWithParam(param){
          return 2 * param;
        },
        /**
         * @public
         */
        testWithMultipleParams(param1, param2){
          return param2 + param1;
        }
      }
    }
    `;
    tester(src, {
      methods: [
        {
          name: 'testWithParam',
          params: [{ name: 'param' }],
        },
        {
          name: 'testWithMultipleParams',
          params: [{ name: 'param1' }, { name: 'param2' }],
        },
      ],
    });
  });

  it('should allow description of methods', () => {
    const src = `
    export default {
      name: 'name-123',
      methods: {
        /**
         * it returns 2
         * @public
         */
        describedFunc(){
          return 2;
        }
      }
    }
    `;
    tester(src, {
      methods: [
        {
          name: 'describedFunc',
          description: 'it returns 2',
        },
      ],
    });
  });

  it('should allow description of params', () => {
    const src = `
    export default {
      name: 'name-123',
      methods: {
        /**
         * @public
         * @param {string} p1 - multiplicateur
         */
        describedParams(p1){
          return p1 * 2;
        }
      }
    }
    `;
    tester(src, {
      methods: [
        {
          name: 'describedParams',
          params: [{ name: 'p1', description: 'multiplicateur', type: { name: 'string' } }],
        },
      ],
    });
  });

  it('should allow description of params without naming them', () => {
    const src = `
    export default {
      name: 'name-123',
      methods: {
        /**
         * @public
         * @param {string} - unnamed param
         * @param {number} - another unnamed param
         */
        describedParams(p, p2){
          return p * 2;
        }
      }
    }
    `;
    tester(src, {
      methods: [
        {
          name: 'describedParams',
          params: [
            { name: 'p', description: 'unnamed param', type: { name: 'string' } },
            { name: 'p2', description: 'another unnamed param', type: { name: 'number' } },
          ],
        },
      ],
    });
  });
});
