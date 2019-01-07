import * as path from 'path';
import { ComponentDoc } from '../../../src/Documentation';
import { parse } from '../../../src/main';

const button = path.join(__dirname, './MyButton.vue');
let docButton: ComponentDoc;

describe('tests button functional', () => {
  beforeEach((done) => {
    docButton = parse(button);
    done();
  });

  it('should have a slot.', () => {
    expect(Object.keys(docButton.slots).length).toEqual(1);
  });

  it('should have a default slot.', () => {
    expect(docButton.slots.default).not.toBeUndefined();
  });

  it('the default slot should have "Use this slot default" as description', () => {
    expect(docButton.slots.default.description).toEqual('Use this slot default');
  });

  it('should the component has size prop description equal The size of the button', () => {
    expect(docButton.props.size.description).toEqual('The size of the button');
  });

  it('should match the snapshot', () => {
    expect(docButton).toMatchSnapshot();
  });
});
