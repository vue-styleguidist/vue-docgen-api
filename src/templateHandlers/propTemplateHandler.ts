import { ASTElement } from 'vue-template-compiler';
import { ComponentDoc } from '../Documentation';

const allowRE = /^(v-bind|:)/;
const propRE = /props\.(\w+)/g;
export default function propTemplateHandler(templateAst: ASTElement, documentation: ComponentDoc) {
  const bindings = templateAst.attrsMap;
  const keys = Object.keys(bindings);
  for (const key of keys) {
    if (allowRE.test(key)) {
      const expression = bindings[key];
      let propArray;
      // tslint:disable-next-line:no-conditional-assignment
      while ((propArray = propRE.exec(expression)) !== null) {
        const propName = propArray[1];
        if (!documentation.props) {
          documentation.props = {};
        }
        if (!documentation.props[propName]) {
          documentation.props[propName] = {
            description: '',
            tags: {},
            required: false,
            type: { name: 'string' },
          };
        }
      }
    }
  }
}
