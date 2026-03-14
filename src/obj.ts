type AnyObject = Record<string, any>

const PATH_CACHE: Record<string, string[]> = {}
let cacheSize = 0
const CACHE_LIMIT = 1000

function parse(key: string): string[] {
  let cached = PATH_CACHE[key]
  if (cached) return cached

  const segments = key.split('.')

  if (cacheSize < CACHE_LIMIT) {
    PATH_CACHE[key] = segments
    cacheSize++
  }

  return segments
}

export function isPath(key: string): boolean {
  return key.indexOf('.') !== -1
}

export function get<T = unknown>(obj: AnyObject, key: string): T | undefined {
  if (key.indexOf('.') === -1) return obj[key] as T | undefined

  const segments = parse(key)
  let current: any = obj

  for (let i = 0, l = segments.length; i < l; i++) {
    if (current == null) return undefined
    current = current[segments[i]]
  }

  return current
}

export function set(obj: AnyObject, key: string, value: unknown): void {
  if (key.indexOf('.') === -1) {
    obj[key] = value
    return
  }

  const segments = parse(key)
  let current: any = obj
  const last = segments.length - 1

  for (let i = 0; i < last; i++) {
    const k = segments[i]
    let next = current[k]

    if (next == null || typeof next !== 'object') {
      next = {}
      current[k] = next
    }

    current = next
  }

  current[segments[last]] = value
}

export function remove(obj: AnyObject, key: string): void {
  if (key.indexOf('.') === -1) {
    delete obj[key]
    return
  }

  const segments = parse(key)
  let current: any = obj
  const last = segments.length - 1

  for (let i = 0; i < last; i++) {
    if (current == null) return
    current = current[segments[i]]
  }

  if (current != null) delete current[segments[last]]
}
const hasOwnProperty = Object.prototype.hasOwnProperty
export function has<T = unknown>(
  obj: AnyObject,
  key: string,
): obj is AnyObject & Record<string, T> {
  if (key.indexOf('.') === -1)
    return hasOwnProperty.call(obj, key)

  const segments = parse(key)
  let current: any = obj

  for (let i = 0, l = segments.length; i < l; i++) {
    if (current == null) return false

    if (!hasOwnProperty.call(current, segments[i]))
      return false

    current = current[segments[i]]
  }

  return true
}
