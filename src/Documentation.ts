import { BlockTag } from './utils/blockTags';
import { Param } from './utils/getDoclets';

export interface PropDescriptor {
  type?: { name: string; func?: boolean };
  description: string;
  required: string | boolean;
  defaultValue?: { value: string; func?: boolean };
  tags: { [title: string]: BlockTag[] };
}

export interface MethodDescriptor {
  name: string;
  description: string;
  returns?: BlockTag;
  tags?: { [key: string]: BlockTag[] };
  params?: Param[];
  [key: string]: any;
}

export interface ComponentDoc {
  displayName: string;
  props: { [propName: string]: PropDescriptor };
  methods: MethodDescriptor[];
  [key: string]: any;
}

export class Documentation {
  private propsMap: Map<string, any>;
  private dataMap: Map<string, any>;
  constructor(initDocumentation: { props?: any; data?: any } = {}) {
    this.propsMap = new Map(adaptToKeyValue(initDocumentation.props));
    this.dataMap = new Map(adaptToKeyValue(initDocumentation.data));
  }

  public set(key: string, value: any) {
    this.dataMap.set(key, value);
  }

  public get(key: string): any {
    return this.dataMap.get(key);
  }

  public getPropDescriptor(propName: string): PropDescriptor {
    let propDescriptor: PropDescriptor = this.propsMap.get(propName) as PropDescriptor;
    if (!propDescriptor) {
      this.propsMap.set(
        propName,
        (propDescriptor = {
          description: '',
          required: '',
          tags: {},
        }),
      );
    }
    return propDescriptor;
  }

  public toObject(): ComponentDoc {
    let props: { [propName: string]: PropDescriptor } = {};

    if (this.propsMap.size > 0) {
      props = {};
      for (const [name, descriptor] of this.propsMap) {
        props[name] = descriptor;
      }
    }

    const obj: { [key: string]: any } = {};
    for (const [key, value] of this.dataMap) {
      obj[key] = value;
    }

    return {
      ...obj,
      props,
      methods: obj.methods,
      displayName: obj.displayName,
    };
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
