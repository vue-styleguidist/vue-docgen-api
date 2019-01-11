import * as path from 'path';
import { ComponentDoc } from '../../../src/Documentation';
import { parse } from '../../../src/main';

const button = path.join(__dirname, './Button.vue');
let docButton: ComponentDoc;
describe('tests button', () => {
  beforeAll((done) => {
    docButton = parse(button);
    done();
  });

  it('should return an object', () => {
    expect(typeof docButton).toEqual('object');
  });
});
