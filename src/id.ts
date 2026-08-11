import { UrlSafeBase64 } from './base64'

const idCache = new Set<string>()

export function newID() {
  let id: string
  let attempts = 0
  const maxAttempts = 10
  do {
    const bytes = new Uint8Array(8)
    crypto.getRandomValues(bytes)

    id = UrlSafeBase64.encode(String.fromCharCode(...bytes)).slice(0, 8)

    attempts++
  } while (idCache.has(id) && attempts < maxAttempts)

  if (idCache.has(id))
    id = id.slice(0, 5) + Date.now().toString(36).slice(-3)
    // Math.random().toString(36).substring(2)

  return id.replace(/[-_]/g, '')
}
