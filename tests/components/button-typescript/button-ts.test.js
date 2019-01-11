import * as path from 'path';

import { parse } from '../../../src/main';
const button = path.join(__dirname, './Button.vue');

let docButton
xdescribe('tests button', () => {
  beforeAll((done) => {
    docButton = parse(button);
    done();
  });

  it('should return an object', () => {
    expect(typeof docButton).toEqual('object');
  });
});
