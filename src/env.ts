import { get, has, set, remove } from './obj'

const obj: Record<string, unknown> = {}

export function hasEnv(key: string) {
  try {
    return has(obj, key) || key in process.env
  } catch {
    return false
  }
}

export function getEnv<T = unknown>(key: string, defaultValue: T): T
export function getEnv<T = unknown>(key: string, defaultValue?: T): T | undefined
export function getEnv<T = unknown>(key: string, defaultValue?: T) {
  try {
    return get<T>(obj, key) ?? process?.env[key] ?? defaultValue
  } catch {
    return defaultValue
  }
}

export function setEnv(key: string, val: unknown) {
  set(obj, key, val)
}
export function addEnv<T = unknown>(env: Record<string, T>) {
  Object.assign(obj, env)
}
export function removeEnv(key: string) {
  remove(obj, key)
}
