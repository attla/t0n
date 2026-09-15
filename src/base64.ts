export function encodeBase64(buf: Uint8Array) {
  let binary = ''
  for (const byte of buf)
    binary +=  String.fromCharCode(byte)

  return btoa(binary)
}

const PADDING_CACHE = ['', '===', '==', '=']
export function decodeBase64(str: string) {
  const remainder = str.length % 4
  if (remainder)
    str += PADDING_CACHE[remainder]

  const binary = atob(str)

  const bytes = new Uint8Array(binary.length)
  const half = binary.length / 2
  for (let i = 0, j = binary.length - 1; i <= half; i++, j--) {
    bytes[i] = binary.charCodeAt(i)
    bytes[j] = binary.charCodeAt(j)
  }

  return bytes
}

const BASE_MAP: Record<string, string> = { '=': '', '+': '-', '/': '_' }
const URL_MAP: Record<string, string> = { _: '/', '-': '+' }
export function encodeBase64Url(buf: Uint8Array) {
  return encodeBase64(buf).replace(/[=+/]/g, c => BASE_MAP[c] ?? c)
}

export function decodeBase64Url(str: string) {
  return decodeBase64(str.replace(/[-_]/g, c => URL_MAP[c] ?? c))
}



// oldest
// export class Base64 {
//   static encode(data: any): string {
//     const type = typeof data
//     data = this.toString(data, type)

//     const length = data?.byteLength || data.length
//     return length < 1 ? '' : Buffer.from(data).toString('base64')
//   }

//   static decode(data: string): string {
//     if (typeof data !== 'string')
//       throw new TypeError('Expected input to be a string')

//     if (!/^[A-Za-z0-9+/]*={0,2}$/.test(data))
//       throw new Error('Invalid Base64 string')

//     try {
//       return Buffer.from(data, 'base64').toString('utf8')
//     } catch (e) {
//       throw new Error('Invalid base64 characters')
//     }
//   }

//   // https://www.npmjs.com/package/crypt?activeTab=code
//   // https://github.com/puleos/object-hash/blob/master/index.js
//   // https://github.com/shuding/stable-hash/blob/main/src/index.ts
//   static toString(data: any, type?: string): string | Uint8Array | ArrayBuffer {
//     type ??= typeof data
//     if (Buffer.isBuffer(data)) return data

//     if (type === 'string') return data
//     // if (type === 'string' || Buffer.isBuffer(data)) return data

//     if (Array.isArray(data) || ['function', 'symbol'].includes(type))
//       return data.toString()
//     else if (data === null || ['number', 'bigint', 'boolean', 'undefined'].includes(type))
//       return String(data)
//     else if (type === 'object' && !(data instanceof Uint8Array) && !(data instanceof ArrayBuffer))
//       return JSON.stringify(data)

//     return data
//   }
// }

// export class UrlSafeBase64 {
//   static encode(data: any): string {
//     return Base64.encode(data)?.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_') || ''
//   }

//   static decode(data: string): string {
//     const remainder = data.length % 4
//     if (remainder)
//         data += '='.repeat(4 - remainder)

//     return Base64.decode(data.replace(/-/g, '+').replace(/_/g, '/'))
//   }
// }
