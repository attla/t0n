import { getLength } from '@/lenght'

class Parent {
  parentProp = 1
}
class Child extends Parent {
  childProp = 2
}

const obj: any = {}
Object.defineProperty(obj, 'hidden', {
  value: 'secret',
  enumerable: false
})
obj.visible = 'shown'

const datasets = Object.entries({
  strings: {
    alfa: ['Now I am become Death, the destroyer of worlds.', 47],
    alfanum: ['0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 62],
    special: ['`~!@#$%^&*()\\][+={}/|:;"\'<>,.?-_', 32],
    acents: ['àáâãäÀÁÂÃÄ çÇ èéêëÈÉÊË ìíîïÌÍÎÏ ñÑ òóôõöÒÓÔÕÖ ùúûüÙÚÛÜ ýÿÝ', 58],
    japanese: ['今、私は世界の破壊者である死になりました。', 21],
    mandarin: ['现在我变成了死神，世界的毁灭者。', 16],
    hindi: ['अब मैं मृत्यु बन गया हूँ, संसारों का नाश करने वाला।', 51],
    others: [" \t\n\r\0\x0B\x0c\xa0", 8],
    'string numeric (FALSE)': ['0', 1],
    'string numeric (TRUE)': ['1', 1],
    'null string (byte)': ['\x00', 1],
    'separator (byte)': ['\x1c', 1],
    'null (byte)': [String.fromCharCode(0), 1],
    'alfa (obj)': [new String('hello'), 5],
  },
  numbers: {
    decimal: [123, 3],
    'decimal (obj)': [new Number(123), 0],
    zero: [0, 1],
    one: [1, 1],
    minus: [-123, 4],
    float: [3.14, 4],
    bigint: [123n, 3],
    'bigint (Obj)': [BigInt('999999999999999999'), 18],
    '1e3': [1e3, 4],
    '1.5e3': [1.5e3, 4],
    MAX_SAFE_INTEGER: [Number.MAX_SAFE_INTEGER, 16],
  },
  objects: {
    obj: [{ a: 1, b: 2, c: 3 }, 3],
    'obj (empty)': [{}, 0],
    fn: [() => { }, 0],
    'inherited props': [new Child(), 2],
    'non-enumerable props': [obj, 1],
  },
  booleans: {
    FALSE: [false, 0],
    TRUE: [true, 0],
    NULL: [null, 0],
    UNDEFINED: [undefined, 0],
  },
  arrays: {
    array: [[4, 2], 2],
    'array (empty)': [[], 0],
  },
  bytes: {
    byte: [0x2A, 2],
    'zero (byte)': [0x0, 1],
  },
})

describe('Length', () => {
  describe.each(datasets)('%s', (_, dataset) => {
    it.each(Object.entries(dataset))('%s', (__, [val, lenght]) => {
      expect(getLength(val)).toBe(lenght)
    })
  })
})
