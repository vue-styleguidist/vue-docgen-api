import getSlots from '../getSlots';

describe('getSlots', () => {
  it('should extract slots from pug', () => {
    const content = [
      'button.buttonComponent(@click.prevent="onClick")',
      '  // @slot Use this slot default',
      '  slot',
    ].join('\n');
    const attrs = { lang: 'pug' };
    expect(getSlots({ type: 'template', content, attrs })).toMatchObject({
      default: { description: 'Use this slot default' },
    });
  });
});
