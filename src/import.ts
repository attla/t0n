export async function IMPORT(path: string) {
  if (process.platform === 'win32' && !path.startsWith('file://'))
    path = 'file://' + path

  return import(path + '?v=' + Date.now())
}
