import babylon from '../../babel-parser';
import resolveExportedComponent from '../resolveExportedComponent';

describe('resolveExportedComponent', () => {
  it('should return an export default', () => {
    const ast = babylon().parse('export default {}');
    expect(resolveExportedComponent(ast.program).length).toBe(1);
  });

  it('should return an es6 export', () => {
    const ast = babylon().parse('export const test = {}');
    expect(resolveExportedComponent(ast.program).length).toBe(1);
  });

  it('should return an es5 export', () => {
    const ast = babylon().parse('module.exports = {};');
    expect(resolveExportedComponent(ast.program).length).toBe(1);
  });

  it('should return an es5 export direct', () => {
    const ast = babylon().parse('exports = {};');
    expect(resolveExportedComponent(ast.program).length).toBe(1);
  });

  it('should return an es5 exports.variable', () => {
    const ast = babylon().parse('exports.xxx = {};');
    expect(resolveExportedComponent(ast.program).length).toBe(1);
  });

  it('should return exportedclass style components', () => {
    const ast = babylon().parse(
      ['@Component()', 'export default class Bart extends testComponent {}'].join('\n'),
    );
    expect(resolveExportedComponent(ast.program).length).toBe(1);
  });
});
