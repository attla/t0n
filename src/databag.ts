export interface Baggable<T = any> {
  all(): Record<string, T>,
  keys(): string[],
  has(key: string): boolean,
  add(data: Record<string, T>): void,
  replace(data: Record<string, T>): void,
  get(key: string, defaultValue?: T): T,
  remove(key: string): void,
  set(key: string, value: T): void,
  clear(): void,
  values(): T[],
  toArray(): [string, T][],
  toJson(options?: number): string,
}

export class DataBag<T = any> implements Baggable<T> {
  protected data: Record<string, T> = {}

  constructor(data: Record<string, T> = {}) {
    this.data = { ...data }
  }

  all(): Record<string, T> {
    return { ...this.data }
  }

  has(key: string): boolean {
    return key in this.data
  }

  add(data: Record<string, T> = {}): void {
    this.data = { ...this.data, ...data }
  }

  replace(data: Record<string, T> = {}): void {
    this.data = { ...data }
  }

  get(key: string, defaultValue?: T): T {
    return this.has(key) ? this.data[key] : defaultValue as T
  }

  set(key: string, value: T): void {
    if (this.has(key) && typeof value != typeof this.data[key])
      throw new TypeError(`Type mismatch for key ${key}. Expected ${typeof this.data[key]}, got ${typeof value}`)

    this.data[key] = value
  }

  remove(key: string): void {
    delete this.data[key]
  }

  clear(): void {
    this.data = {}
  }

  get length(): number {
    return this.keys().length
  }
  get size(): number {
    return this.length
  }

  keys(): string[] {
    return Object.keys(this.data)
  }

  values(): T[] {
    return Object.values(this.data)
  }

  entries(): [string, T][] {
    return Object.entries(this.data)
  }

  toArray(): [string, T][] {
    return this.entries()
  }

  jsonSerialize(): Record<string, T> {
    return this.all()
  }

  toJson(options: number = 0): string {
    return JSON.stringify(this.all(), null, options)
  }

  [Symbol.iterator](): IterableIterator<[string, T]> {
    return this.entries()[Symbol.iterator]()
  }
}
