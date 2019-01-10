import * as bt from '@babel/types';
import babylon from '../../babel-parser';
jest.mock('../resolveRequired');
jest.mock('../resolvePathFrom');
jest.mock('../../main');
import { parse } from '../../main';
import getRequiredExtendsDocumentations from '../getRequiredExtendsDocumentations';
import resolveExportedComponent from '../resolveExportedComponent';
import resolvePathFrom from '../resolvePathFrom';
import resolveRequired from '../resolveRequired';

describe('getRequiredExtendsDocumentations', () => {
  let resolveRequiredMock: jest.Mock;
  let mockResolvePathFrom: jest.Mock;
  let mockParse: jest.Mock;
  beforeEach(() => {
    resolveRequiredMock = resolveRequired as jest.Mock<
      (ast: bt.Program, varNameFilter?: string[]) => { [key: string]: string }
    >;
    resolveRequiredMock.mockReturnValue({ testComponent: './componentPath' });

    mockResolvePathFrom = resolvePathFrom as jest.Mock<(path: string, from: string) => string>;
    mockResolvePathFrom.mockReturnValue('./component/full/path');

    mockParse = parse as jest.Mock;
    mockParse.mockReturnValue({ component: 'documentation' });
  });

  function parseItExtends(src: string) {
    const ast = babylon().parse(src);
    const path = resolveExportedComponent(ast.program);
    getRequiredExtendsDocumentations(ast.program, path, '');
  }

  it('should resolve extended modules variables in import default', () => {
    const src = [
      'import testComponent from "./testComponent"',
      'export default {',
      '  extends:testComponent',
      '}',
    ].join('\n');
    parseItExtends(src);
    expect(parse).toHaveBeenCalledWith('./component/full/path');
  });

  it('should resolve extended modules variables in require', () => {
    const src = [
      'const testComponent = require("./testComponent");',
      'export default {',
      '  extends:testComponent',
      '}',
    ].join('\n');
    parseItExtends(src);
    expect(parse).toHaveBeenCalledWith('./component/full/path');
  });

  it('should resolve extended modules variables in import', () => {
    const src = [
      'import { testComponent, other } from "./testComponent"',
      'export default {',
      '  extends:testComponent',
      '}',
    ].join('\n');
    parseItExtends(src);
    expect(parse).toHaveBeenCalledWith('./component/full/path');
  });

  it('should resolve extended modules variables in class style components', () => {
    const src = [
      'import { testComponent} from "./testComponent"',
      'export default class Bart extends testComponent {',
      '}',
    ].join('\n');
    parseItExtends(src);
    expect(parse).toHaveBeenCalledWith('./component/full/path');
  });
});
