export async function IMPORT<T extends unknown>(path: string): Promise<T>
export async function IMPORT<T extends unknown>(path: string, name: string): Promise<T>
export async function IMPORT<T extends unknown>(path: string, ...name: string[]): Promise<Record<string, T>> {
  if (process.platform === 'win32' && !path.startsWith('file://'))
    path = 'file://' + path

  const source = path +'?v='+ Date.now()

  if (name.length > 0) {
    const module = await import(source)
    const result: Record<string, any> = {}
    for (const n of name) {
      if (n in module)
        result[n] = module[n]
      else
        throw new Error(`Module ${path} does not export ${n}`)
    }

    return name.length === 1 ? result[name[0]] : result
  }

  return import(source)
}
