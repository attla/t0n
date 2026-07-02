const normalize = (text: string, sep: string) =>
  text.replace(/([a-z])([A-Z])/g, `$1${sep}$2`)
    .replace(/[\s\-_]+/g, sep)
    .toLowerCase()
    .replace(new RegExp(`[^\\w${sep}]+`, 'g'), '')
    .replace(new RegExp(`${sep}{2,}`, 'g'), sep)
    .replace(new RegExp(`^${sep}+|${sep}+$`, 'g'), '')

export const snakeCase = (text: string) => normalize(text, '_')
export const kebabCase = (text: string) => normalize(text, '-')

export const camelCase = (text: string) =>
  text.replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
