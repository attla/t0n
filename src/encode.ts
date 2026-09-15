const encoder = new TextEncoder()
const dencoder = new TextDecoder()

export function textEncode(val: string) {
  return encoder.encode(val) as Uint8Array
}
export function textDecode(val: Uint8Array) {
  return dencoder.decode(val)
}

const HEX = '0123456789abcdef'
export function bytesToHex(buffer: Uint8Array): string {
  const bytes = new Uint8Array(buffer)
  const hex = new Array<string>(bytes.length * 2)

  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i]

    hex[i * 2] = HEX[byte >>> 4]
    hex[i * 2 + 1] = HEX[byte & 0x0f]
  }

  return hex.join('')
}
