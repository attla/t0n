import { encodeBase64, decodeBase64, encodeBase64Url, decodeBase64Url } from '@/base64'
import { strings } from './testcase'
import { textDecode, textEncode } from '@/encode'

describe('Base64: Encode & Decode ', () => {
  it.each(strings)('%s', (_, value) => {
    const encoded = encodeBase64(textEncode(value))
    expect(encoded).toBeString()
    expect(textDecode(decodeBase64(encoded))).toBe(value)
  })
})

describe('UrlSafeBase64: Encode & Decode', () => {
  it.each(strings)('%s', (_, value) => {
    const encoded = encodeBase64Url(textEncode(value))
    expect(encoded).toBeString()
    expect(textDecode(decodeBase64Url(encoded))).toBe(value)
  })
})
