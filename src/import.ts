export async function $import(path: string) {
  return import(path +'?v='+ Date.now())
}
