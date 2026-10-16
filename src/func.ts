export function isAsync(value: any): value is Promise<any> {
  return value && typeof value.then === 'function'
}

export const isPromise = isAsync
