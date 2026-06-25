const emitter = new EventTarget()

const listeners = new Map<string, Map<Function, EventListener>>()

export const getEvents = () => Array.from(listeners.keys())

const getListeners = (event: string) => {
  if (!listeners.has(event)) {
    listeners.set(event, new Map())
  }
  return listeners.get(event)!
}

const createHandler = <E>(callback: (detail: E) => void): EventListener => (e: Event) => callback((e as CustomEvent<E>).detail)

export const emit = <D = unknown>(
  event: string, 
  detail?: D
) => emitter.dispatchEvent(new CustomEvent(event, detail ? { detail } : undefined))

export const on = <D = unknown>(
  event: string,
  callback: (detail: D) => void
): () => void => {
  const handler = createHandler<D>(callback)
  getListeners(event).set(callback, handler)
  emitter.addEventListener(event, handler)
  
  return () => off(event, callback)
}

export const once = <D = unknown>(
  event: string,
  callback: (detail: D) => void
) => {
  const handler: EventListener = (e: Event) => {
    callback((e as CustomEvent<D>).detail)
    
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
