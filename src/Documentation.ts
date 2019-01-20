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
  constructor() {
    this.propsMap = new Map()
    this.methodsMap = new Map()
    this.slotsMap = new Map()
    this.eventsMap = new Map()
    this.dataMap = new Map()
  }

  public set(key: string, value: any) {
    this.dataMap.set(key, value)
  }

  public get(key: string): any {
    return this.dataMap.get(key)
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

  public getPropDescriptor(propName: string): PropDescriptor {
    return this.getDescriptor(propName, this.propsMap, () => ({
      description: '',
      tags: {},
    }))
  }

  private getPropsObject(): { [propName: string]: PropDescriptor } | undefined {
    return this.getObjectFromDescriptor(this.propsMap)
  }

  public getMethodDescriptor(methodName: string): MethodDescriptor {
    return this.getDescriptor(methodName, this.methodsMap, () => ({
      name: methodName,
      modifiers: [],
      description: '',
      tags: {},
    }))
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

  public getEventsDescriptor(eventName: string): EventDescriptor {
    return this.getDescriptor(eventName, this.eventsMap, () => ({
      properties: [],
      description: '',
      tags: [],
    }))
  }

  private getEventsObject(): { [eventName: string]: EventDescriptor } | undefined {
    return this.getObjectFromDescriptor(this.eventsMap)
  }

  public getSlotDescriptor(slotName: string): SlotDescriptor {
    return this.getDescriptor(slotName, this.slotsMap, () => ({
      description: '',
      tags: {},
    }))
  }

  private getSlotsObject(): { [slotName: string]: SlotDescriptor } {
    return this.getObjectFromDescriptor(this.slotsMap) || {}
  }

  public toObject(): ComponentDoc {
    const props = this.getPropsObject()
    const methods = this.getMethodsObject()
    const events = this.getEventsObject()
    const slots = this.getSlotsObject()

    const obj: { [key: string]: any } = {}
    for (const [key, value] of this.dataMap.entries()) {
      obj[key] = value
    }

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
}
