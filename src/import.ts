export async function IMPORT(path: string) {
  return import(path +'?v='+ Date.now())
}
