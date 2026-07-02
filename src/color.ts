// Refs: https://github.com/alexeyraspopov/picocolors/commit/6f0a4638348ed20633d623ee973f9c9a96f65104, https://github.com/delucis/piccolore/tree/main/src

import { getColorEnabledAsync } from 'hono/utils/color'

export const enabled = await getColorEnabledAsync()
export const isColorSupported = enabled

const replaceClose = (
  str: string,
  close: string,
  replace: string,
  index: number
): string => {
  const start = str.substring(0, index) + replace
  const end = str.substring(index + close.length)
  const nextIndex = end.indexOf(close)
  return ~nextIndex
    ? start + replaceClose(end, close, replace, nextIndex)
    : start + end
}

const f = (open: string, close: string, replace = open) => {
  if (!enabled) return String
  return (input: string) => {
    const string = '' + input
    const index = string.indexOf(close, open.length)
    return ~index
      ? open + replaceClose(string, close, replace, index) + close
      : open + string + close
  }
}

export const reset = f('\x1b[0m', '\x1b[0m')
export const bold = f('\x1b[1m', '\x1b[22m', '\x1b[22m\x1b[1m')
export const dim = f('\x1b[2m', '\x1b[22m', '\x1b[22m\x1b[2m')
export const italic = f('\x1b[3m', '\x1b[23m')
export const underline = f('\x1b[4m', '\x1b[24m')
export const inverse = f('\x1b[7m', '\x1b[27m')
export const hidden = f('\x1b[8m', '\x1b[28m')
export const strikethrough = f('\x1b[9m', '\x1b[29m')

const endText = '\x1b[39m'
export const black = f('\x1b[30m', endText)
export const red = f('\x1b[31m', endText)
export const green = f('\x1b[32m', endText)
export const yellow = f('\x1b[33m', endText)
export const blue = f('\x1b[34m', endText)
export const magenta = f('\x1b[35m', endText)
export const purple = f('\x1b[38;2;173;127;168m', endText)
export const cyan = f('\x1b[36m', endText)
export const white = f('\x1b[37m', endText)
export const gray = f('\x1b[90m', endText)

const endBg = '\x1b[49m'
export const bgBlack = f('\x1b[40m', endBg)
export const bgRed = f('\x1b[41m', endBg)
export const bgGreen = f('\x1b[42m', endBg)
export const bgYellow = f('\x1b[43m', endBg)
export const bgBlue = f('\x1b[44m', endBg)
export const bgMagenta = f('\x1b[45m', endBg)
export const bgCyan = f('\x1b[46m', endBg)
export const bgWhite = f('\x1b[47m', endBg)

export const blackBright = f('\x1b[90m', endText)
export const redBright = f('\x1b[91m', endText)
export const greenBright = f('\x1b[92m', endText)
export const yellowBright = f('\x1b[93m', endText)
export const blueBright = f('\x1b[94m', endText)
export const magentaBright = f('\x1b[95m', endText)
export const cyanBright = f('\x1b[96m', endText)
export const whiteBright = f('\x1b[97m', endText)

export const bgBlackBright = f('\x1b[100m', endBg)
export const bgRedBright = f('\x1b[101m', endBg)
export const bgGreenBright = f('\x1b[102m', endBg)
export const bgYellowBright = f('\x1b[103m', endBg)
export const bgBlueBright = f('\x1b[104m', endBg)
export const bgMagentaBright = f('\x1b[105m', endBg)
export const bgCyanBright = f('\x1b[106m', endBg)
export const bgWhiteBright = f('\x1b[107m', endBg)
