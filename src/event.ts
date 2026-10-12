const emitter: EventTarget = typeof window !== 'undefined' ? window : new EventTarget()

const listeners = new Map<string, Map<Function, EventListener>>()

export const getEvents = () => Array.from(listeners.keys())

const getListeners = (event: string) => {
  if (!listeners.has(event))
    listeners.set(event, new Map())

  return listeners.get(event)!
}

const resolvePayload = (e: Event) => (e instanceof CustomEvent ? e.detail : e)

const createHandler = <E>(callback: (detail: E) => void): EventListener => (e: Event) => callback(resolvePayload(e) as E)

export const emit = <D = unknown>(
  event: string,
  detail?: D
) => emitter.dispatchEvent(new CustomEvent(event, detail !== undefined ? { detail } : undefined))


export function on<K extends keyof WindowEventMap>(
  event: K,
  callback: (e: WindowEventMap[K]) => void
): () => void
export function on<D = unknown>(
  event: string,
  callback: (detail: D) => void
): () => void
export function on(event: string, callback: (detail: any) => void) {
  const handler = createHandler(callback)
  getListeners(event).set(callback, handler)
  emitter.addEventListener(event, handler)

  return () => off(event, callback)
}

export function once<K extends keyof WindowEventMap>(
  event: K,
  callback: (e: WindowEventMap[K]) => void
): () => void
export function once<D = unknown>(
  event: string,
  callback: (detail: D) => void
): () => void
export function once(event: string, callback: (detail: any) => void) {
  const handler: EventListener = (e: Event) => {
    callback(resolvePayload(e))

    const eventListeners = listeners.get(event)
    if (eventListeners) {
      eventListeners.delete(callback)
      if (eventListeners.size === 0)
        listeners.delete(event)
    }
  }

  getListeners(event).set(callback, handler)
  emitter.addEventListener(event, handler, { once: true })

  return () => off(event, callback)
}

export const off = <D = unknown>(
  event: string,
  callback?: (detail: D) => void
) => {
  if (!callback) return removeAll(event)

  const eventListeners = listeners.get(event)
  if (!eventListeners) return

  const handler = eventListeners.get(callback)
  if (handler) {
    emitter.removeEventListener(event, handler)
    eventListeners.delete(callback)

    if (eventListeners.size === 0)
      listeners.delete(event)
  }
}

export const removeAll = (event: string) => {
  const eventListeners = listeners.get(event)
  if (!eventListeners) return

  for (const [, handler] of eventListeners)
    emitter.removeEventListener(event, handler)

  listeners.delete(event)
}

export const clearAll = () => {
  for (const [event, eventListeners] of listeners) {
    for (const [, handler] of eventListeners)
      emitter.removeEventListener(event, handler)
  }

  listeners.clear()
}

export const hasListener = (event: string, callback?: Function) => {
  const eventListeners = listeners.get(event)
  if (!eventListeners) return false
  return callback ? eventListeners.has(callback) : eventListeners.size > 0
}

export const countEvent = (event?: string) => {
  if (event)
    return listeners.get(event)?.size ?? 0

  let total = 0
  for (const [, eventListeners] of listeners)
    total += eventListeners.size

  return total
}
