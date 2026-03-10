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
  toJson(options?: number): string
}

function walk(
  root: Record<string, any>,
  path: string,
  create = false
): [Record<string, any>, string] | null {
  let obj = root
  let start = 0

  for (let i = 0; i < path.length; i++) {
    if (path.charCodeAt(i) === 46) { // '.'
      const key = path.slice(start, i)
      let next = obj[key]

      if (next === undefined) {
        if (!create) return null
        next = obj[key] = {}
      }

      if (typeof next !== 'object' || next === null) {
        if (!create) return null
        next = obj[key] = {}
      }

      obj = next
      start = i + 1
    }
  }

  return [obj, path.slice(start)]
}

export class DataBag<T = any> implements Baggable<T> {
  protected data: Record<string, T>

  constructor(data: Record<string, T> = {}) {
    this.data = { ...data }
  }

  all(): Record<string, T> {
    return { ...this.data }
  }

  has(key: string): boolean {
    if (!key.includes('.'))
      return key in this.data

    const resolved = walk(this.data, key)
    if (!resolved) return false

    const [obj, prop] = resolved
    return prop in obj
  }

  get(key: string, defaultValue?: T): T {
    if (!key.includes('.')) {
      const v = this.data[key]
      return (v !== undefined ? v : defaultValue) as T
    }

    const resolved = walk(this.data, key)
    if (!resolved) return defaultValue as T

    const [obj, prop] = resolved
    const value = obj[prop]

    return (value !== undefined ? value : defaultValue) as T
  }

  set(key: string, value: T) {
    if (!key.includes('.')) {
      const current = this.data[key]

      if (current !== undefined && typeof current !== typeof value)
        throw new TypeError(
          `Type mismatch for key '${key}'. Expected ${typeof current}, got ${typeof value}`
        )

      this.data[key] = value
      return
    }

    const resolved = walk(this.data, key, true)!
    const [obj, prop] = resolved

    const current = obj[prop]

    if (current !== undefined && typeof current !== typeof value)
      throw new TypeError(
        `Type mismatch for key '${key}'. Expected ${typeof current}, got ${typeof value}`
      )

    obj[prop] = value
  }

  remove(key: string) {
    if (!key.includes('.')) {
      delete this.data[key]
      return
    }

    const resolved = walk(this.data, key)
    if (!resolved) return

    const [obj, prop] = resolved
    delete obj[prop]
  }

  add(data: Record<string, T> = {}) {
    Object.assign(this.data, data)
  }

  replace(data: Record<string, T> = {}) {
    this.data = { ...data }
  }

  clear() {
    this.data = {}
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
    return JSON.stringify(this.data, null, options)
  }

  get length(): number {
    return Object.keys(this.data).length
  }

  get size(): number {
    return this.length
  }

  [Symbol.iterator](): IterableIterator<[string, T]> {
    return this.entries()[Symbol.iterator]()
  }
}
