import * as bt from '@babel/types';
import babylon from '../../babel-parser';
jest.mock('../resolveRequired');
jest.mock('../resolvePathFrom');
jest.mock('../../main');
import resolveExportedComponent from '../resolveExportedComponent';
import getRequiredExtendsDocumentations from '../getRequiredExtendsDocumentations';
import resolveRequired from '../resolveRequired';
import resolvePathFrom from '../resolvePathFrom';
import { parse } from '../../main';

describe('getRequiredExtendsDocumentations', () => {
  let resolveRequiredMock: jest.Mock;
  let mockResolvePathFrom: jest.Mock;
  let mockParse: jest.Mock;
  beforeEach(() => {
    resolveRequiredMock = resolveRequired as jest.Mock<
      (ast: bt.Program, varNameFilter?: string[]) => { [key: string]: string }
    >;
    resolveRequiredMock.mockReturnValue({ testComponent: 'componentPath' });

    mockResolvePathFrom = resolvePathFrom as jest.Mock<(path: string, from: string) => string>;
    mockResolvePathFrom.mockReturnValue('component/full/path');

    mockParse = parse as jest.Mock;
    mockParse.mockReturnValue({ component: 'documentation' });
  });

  it.each([
    [
      'import testComponent from "./testComponent"',
      'export default {',
      '  extends:testComponent',
      '}',
    ].join('\n'),
    [
      'import { testComponent, other } from "./testComponent"',
      'export default {',
      '  extends:testComponent',
      '}',
    ].join('\n'),
    [
      'const testComponent = require("./testComponent");',
      'export default {',
      '  extends:testComponent',
      '}',
    ].join('\n'),
  ])('should resolve extended modules variables', (src) => {
    const ast = babylon().parse(src);
    const path = resolveExportedComponent(ast.program);
    getRequiredExtendsDocumentations(ast.program, path, '');
    expect(parse).toHaveBeenCalledWith('component/full/path');
  });
});
