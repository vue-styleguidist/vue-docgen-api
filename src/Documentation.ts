import Map from 'ts-map'

export type BlockTag = ParamTag | Tag

export interface ParamType {
  name: string
  elements?: ParamType[]
}

export interface UnnamedParam {
  type?: ParamType
  description?: string | boolean
}

export interface Param extends UnnamedParam {
  name?: string
}

interface RootTag {
  title: string
}

export interface Tag extends RootTag {
  content: string | boolean
}

export interface ParamTag extends RootTag, Param {}

export interface DocBlockTags {
  description: string
  tags?: Array<ParamTag | Tag>
}

interface EventType {
  names: string[]
}

interface EventProperty {
  type: EventType
  name?: string
  description?: string | boolean
}

export interface EventDescriptor extends DocBlockTags {
  type?: EventType
  properties: EventProperty[] | undefined
}

export interface PropDescriptor {
  type?: { name: string; func?: boolean }
  description: string
  required?: string | boolean
  defaultValue?: { value: string; func?: boolean }
  tags: { [title: string]: BlockTag[] }
}

export interface MethodDescriptor {
  name: string
  description: string
  returns?: UnnamedParam
  tags?: { [key: string]: BlockTag[] }
  params?: Param[]
  modifiers: string[]
  [key: string]: any
}

export interface SlotDescriptor {
  description?: string
  bindings?: Record<string, any>
}

export interface ComponentDoc {
  displayName: string
  props: { [propName: string]: PropDescriptor } | undefined
  methods: MethodDescriptor[]
  slots: { [name: string]: SlotDescriptor }
  events?: { [name: string]: EventDescriptor }
  [key: string]: any
}

export class Documentation {
  private propsMap: Map<string, PropDescriptor>
  private methodsMap: Map<string, MethodDescriptor>
  private slotsMap: Map<string, SlotDescriptor>
  private eventsMap: Map<string, any>
  private dataMap: Map<string, any>
  constructor(initDocumentation?: ComponentDoc) {
    this.propsMap = new Map(
      initDocumentation ? adaptToKeyValue(initDocumentation.props) : undefined,
    )
    this.methodsMap = new Map(
      initDocumentation ? adaptToKeyValue(initDocumentation.methods) : undefined,
    )
    this.slotsMap = new Map(
      initDocumentation ? adaptToKeyValue(initDocumentation.slots) : undefined,
    )
    this.eventsMap = new Map(
      initDocumentation ? adaptToKeyValue(initDocumentation.events) : undefined,
    )
    this.dataMap = new Map(
      adaptToKeyValue(initDocumentation ? adaptToKeyValue(initDocumentation) : undefined),
    )
  }

  public set(key: string, value: any) {
    this.dataMap.set(key, value)
  }

  public get(key: string): any {
    return this.dataMap.get(key)
  }

  public getPropDescriptor(propName: string): PropDescriptor {
    return this.getDescriptor(propName, this.propsMap, () => ({
      description: '',
      tags: {},
    }))
  }

  public getMethodDescriptor(methodName: string): MethodDescriptor {
    return this.getDescriptor(methodName, this.methodsMap, () => ({
      name: methodName,
      modifiers: [],
      description: '',
      tags: {},
    }))
  }

  public getEventDescriptor(eventName: string): EventDescriptor {
    return this.getDescriptor(eventName, this.eventsMap, () => ({
      properties: [],
      description: '',
      tags: [],
    }))
  }

  public getSlotDescriptor(slotName: string): SlotDescriptor {
    return this.getDescriptor(slotName, this.slotsMap, () => ({
      description: '',
      tags: {},
    }))
  }

  public toObject(): ComponentDoc {
    const props = this.getPropsObject()
    const methods = this.getMethodsObject()
    const events = this.getEventsObject()
    const slots = this.getSlotsObject()

    const obj: { [key: string]: any } = {}
    this.dataMap.forEach((value, key) => {
      if (key) {
        obj[key] = value
      }
    })

    return {
      // initialize non null params
      description: '',
      tags: {},

      // set all the component params (override init values)
      ...obj,

      // set all the static properties
      displayName: obj.displayName,
      props,
      events,
      methods,
      slots,
    }
  }

  private getDescriptor<T>(name: string, map: Map<string, T>, init: () => T): T {
    let descriptor = map.get(name)
    if (!descriptor) {
      map.set(name, (descriptor = init()))
    }
    return descriptor
  }

  private getObjectFromDescriptor<T>(map: Map<string, T>): { [name: string]: T } | undefined {
    if (map.size > 0) {
      const obj: { [name: string]: T } = {}
      map.forEach((descriptor, name) => {
        if (name && descriptor) {
          obj[name] = descriptor
        }
      })
      return obj
    } else {
      return undefined
    }
  }

  private getPropsObject(): { [propName: string]: PropDescriptor } | undefined {
    return this.getObjectFromDescriptor(this.propsMap)
  }

  private getMethodsObject(): MethodDescriptor[] {
    const methods: MethodDescriptor[] = []
    this.methodsMap.forEach((descriptor, name) => {
      if (name && methods && descriptor) {
        methods.push(descriptor)
      }
    })
    return methods
  }

  private getEventsObject(): { [eventName: string]: EventDescriptor } | undefined {
    return this.getObjectFromDescriptor(this.eventsMap)
  }

  private getSlotsObject(): { [slotName: string]: SlotDescriptor } {
    return this.getObjectFromDescriptor(this.slotsMap) || {}
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
        const kvp: [string, any] = [k, obj[k]]
        return kvp
      })
    : []
  return keyValuePairs
}
