import * as Obj from './obj'

export interface Baggable<T = any> {
  all(): Record<string, T>
  keys(): string[]
  has(key: string): boolean
  add(data: Record<string, T>): void
  replace(data: Record<string, T>): void
  get(key: string, defaultValue?: T): T
  remove(key: string): void
  set(key: string, value: T): void
  clear(): void
  values(): T[]
  toArray(): [string, T][]
  toJson(replacer?: (string | number)[] | null, space?: string | number): string
}

export class DataBag<T = any> implements Baggable<T> {
  #data: Record<string, T>

  constructor(data: Record<string, T> = {}) {
    this.#data = { ...data }
  }

  all(): Record<string, T> {
    return { ...this.#data }
  }

  has(key: string): boolean {
    return Obj.has(this.#data, key)
  }

  get(key: string, defaultValue?: T): T {
    const value = Obj.get(this.#data, key)
    return (value !== undefined ? value : defaultValue) as T
  }

  set(key: string, value: T) {
    Obj.set(this.#data, key, value)
  }

  remove(key: string) {
    Obj.remove(this.#data, key)
  }

  add(data: Record<string, T> = {}) {
    Object.assign(this.#data, data)
  }

  replace(data: Record<string, T> = {}) {
    this.#data = { ...data }
  }

  clear() {
    this.#data = {}
  }

  get length() {
    return Object.keys(this.#data).length
  }
  get size() {
    return this.length
  }

  keys() {
    return Object.keys(this.#data)
  }

  values(): T[] {
    return Object.values(this.#data)
  }

  entries() {
    return Object.entries(this.#data)
  }

  toArray() {
    return this.entries()
  }

  jsonSerialize() {
    return this.all()
  }

  toJson(replacer: (string | number)[] | null | undefined = null, space: string | number = 0) {
    return JSON.stringify(this.#data, replacer, space)
  }

  [Symbol.iterator](): IterableIterator<[string, T]> {
    return this.entries()[Symbol.iterator]()
  }
}
