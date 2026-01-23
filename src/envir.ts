import { DataBag } from './databag'

export class Envir {
  static #memory: DataBag

  static {
    this.#memory = new DataBag()
  }

  static has(key: string): boolean {
    try {
      return this.#memory.has(key) || key in process.env
    } catch {
      return false
    }
  }

  static get<T = any>(key: string, defaultValue?: T): T | undefined {
    if (this.#memory.has(key))
      return this.#memory.get(key, defaultValue) as T

    try {
      const envValue = process?.env[key]
      return envValue !== undefined ? envValue as T : defaultValue
    } catch {
      return defaultValue
    }
  }

  static set<T = any>(key: string, value: T): void {
    this.#memory.set(key, value)
  }

  static remove(key: string): void {
    this.#memory.remove(key)
  }

  static add<T = any>(data: Record<string, T> = {}): void {
    this.#memory.add(data)
  }

  static replace<T = any>(data: Record<string, T> = {}): void {
    this.#memory.replace(data)
  }
}
