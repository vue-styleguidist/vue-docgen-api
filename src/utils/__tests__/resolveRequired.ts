import babylon from '../../babel-parser';
import resolveRequired from '../resolveRequired';

describe('resolveRequired', () => {
  it('should resolve imported variables', () => {
    const ast = babylon().parse('import {test, bonjour} from "test/path";');
    const varNames = resolveRequired(ast.program);
    expect(varNames).toMatchObject({ test: 'test/path', bonjour: 'test/path' });
  });

  it('should resolve imported default', () => {
    const ast = babylon().parse('import bonjour from "test/path";');
    const varNames = resolveRequired(ast.program);
    expect(varNames).toMatchObject({ bonjour: 'test/path' });
  });

  it('should resolve required variables', () => {
    const ast = babylon().parse(
      [
        'const hello = require("test/pathEN");',
        'const { bonjour } = require("test/pathFR");',
        '',
      ].join('\n'),
    );
    expect(resolveRequired(ast.program)).toMatchObject({
      hello: 'test/pathEN',
      bonjour: 'test/pathFR',
    });
  });

  it('should require even default', () => {
    const ast = babylon().parse(
      [
        'const { ciao, astaruego } = require("test/pathOther");',
        'const sayonara = require("test/pathJP").default;',
        '',
      ].join('\n'),
    );
    expect(resolveRequired(ast.program)).toMatchObject({
      ciao: 'test/pathOther',
      astaruego: 'test/pathOther',
      sayonara: 'test/pathJP',
    });
  });

  it('should not require non required variables', () => {
    const ast = babylon().parse('const sayonara = "Japanese Hello";');
    expect(resolveRequired(ast.program).sayonara).toBeUndefined();
  });
});
