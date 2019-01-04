import { BlockTag } from './utils/blockTags';

interface PropDescriptor {
  comment: string;
  description: string;
  required: string | boolean;
  tags: { [title: string]: BlockTag };
}

interface MethodDescriptor {
  name: string;
}

interface ComponentDoc {
  props: { [propName: string]: PropDescriptor } | undefined;
  methods: MethodDescriptor[] | undefined;
  [key: string]: any;
}

export class Documentation {
  private _props: Map<string, any>;
  private _data: Map<string, any>;
  constructor(initDocumentation: { props?: any; data?: any } = {}) {
    this._props = new Map(adaptToKeyValue(initDocumentation.props));
    this._data = new Map(adaptToKeyValue(initDocumentation.data));
  }

  public set(key: string, value: any) {
    this._data.set(key, value);
  }

  public get(key: string): any {
    return this._data.get(key);
  }

  public getPropDescriptor(propName: string): PropDescriptor {
    let propDescriptor: PropDescriptor = this._props.get(propName) as PropDescriptor;
    if (!propDescriptor) {
      this._props.set(
        propName,
        (propDescriptor = {
          comment: '',
          description: '',
          required: '',
          tags: {},
        }),
      );
    }
    return propDescriptor;
  }

  public toObject() {
    const obj: ComponentDoc = {
      props: undefined,
      methods: undefined,
    };

    for (const [key, value] of this._data) {
      obj[key] = value;
    }

    if (this._props.size > 0) {
      obj.props = {};
      for (const [name, descriptor] of this._props) {
        obj.props[name] = descriptor;
      }
    }

    return obj;
  }
}

/**
 * Transforms an object into an array of tuples [key, value]
 * @param {Object} obj
 * @returns {Array<[key, value]>} the retransfromed array and [] if obj is null
 */
function adaptToKeyValue(obj: { [key: string]: any } | undefined): Array<[string, any]> {
  const keyValuePairs: Array<[string, any]> = obj
    ? Object.keys(obj).map((k: string) => {
        const kvp: [string, any] = [k, obj[k]];
        return kvp;
      })
    : [];
  return keyValuePairs;
}

module.exports = Documentation;
