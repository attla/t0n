const IDENTIFIER_RE = /^[$_\p{ID_Start}][$_\u200C\u200D\p{ID_Continue}]*$/u

export function JSJSON(value: unknown): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'

  const type = typeof value

  if (type === 'string') return JSON.stringify(value)
  if (type === 'number' || type === 'boolean') return String(value)
  if (type === 'bigint') return `${value}n`
  if (type === 'function') return value.toString()

  if (Array.isArray(value))
    return `[${value.map(JSJSON).join(',')}]`

  if (type === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([key, val]) => `${IDENTIFIER_RE.test(key) ? key : JSON.stringify(key)}:${JSJSON(val)}`)

    return `{${entries.join(',')}}`
  }

  return 'undefined'
}
