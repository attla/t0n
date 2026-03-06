import { LRUCache } from './lru-cache'

export type OsType = 'desktop' | 'tablet' | 'mobile' | 'tv' | 'bot' | 'unknown'

const UNKNOWN = 'unknown'

export type IUAResult = {
  browser: {
    name: string,
    version: string,
  }
  os: {
    name: string,
    type: OsType,
  }
  raw?: string | null,
}

type IBrowserRule = {
  name: string,
  pattern: RegExp,
}

type IOsRule = {
  name: string,
  pattern: RegExp,
  type: OsType,
}

const BROWSER_RULES: readonly IBrowserRule[] = [

  // Bots / Crawlers
  { name: 'Googlebot', pattern: /Googlebot\/([\d.]+)/i },
  { name: 'Googlebot-Image', pattern: /Googlebot-Image/i },
  { name: 'Googlebot-News', pattern: /Googlebot-News/i },
  { name: 'GoogleOther', pattern: /GoogleOther/i },

  { name: 'Bingbot', pattern: /bingbot\/([\d.]+)/i },
  { name: 'YandexBot', pattern: /YandexBot\/([\d.]+)/i },
  { name: 'DuckDuckBot', pattern: /DuckDuckBot\/([\d.]+)/i },
  { name: 'Baiduspider', pattern: /Baiduspider\/([\d.]+)/i },
  { name: 'Slurp', pattern: /Slurp/i },

  { name: 'Applebot', pattern: /Applebot\/([\d.]+)/i },
  { name: 'SemrushBot', pattern: /SemrushBot/i },
  { name: 'AhrefsBot', pattern: /AhrefsBot/i },
  { name: 'MJ12bot', pattern: /MJ12bot/i },
  { name: 'DotBot', pattern: /DotBot/i },
  { name: 'PetalBot', pattern: /PetalBot/i },

  // AI Crawlers
  { name: 'GPTBot', pattern: /GPTBot/i },
  { name: 'ChatGPT-User', pattern: /ChatGPT-User/i },
  { name: 'CCBot', pattern: /CCBot/i },
  { name: 'PerplexityBot', pattern: /PerplexityBot/i },
  { name: 'ClaudeBot', pattern: /ClaudeBot/i },
  { name: 'Amazonbot', pattern: /Amazonbot/i },

  // In-app browsers
  { name: 'Instagram', pattern: /Instagram/i },
  { name: 'Facebook', pattern: /FBAN|FBAV/i },
  { name: 'TikTok', pattern: /TikTok/i },
  { name: 'LinkedIn', pattern: /LinkedInApp/i },
  { name: 'Discord', pattern: /Discord/i },
  { name: 'Telegram', pattern: /Telegram/i },
  { name: 'Snapchat', pattern: /Snapchat/i },
  { name: 'Line', pattern: /Line\/([\d.]+)/i },

  // Chromium family
  { name: 'Arc', pattern: /Arc\/([\d.]+)/i },
  { name: 'Arc Search', pattern: /ArcSearch/i },

  { name: 'Edge', pattern: /Edg\/([\d.]+)/i },
  { name: 'Edge (Legacy)', pattern: /Edge\/([\d.]+)/i },

  { name: 'Opera', pattern: /OPR\/([\d.]+)/i },
  { name: 'Opera', pattern: /Opera\/([\d.]+)/i },

  { name: 'Brave', pattern: /Brave\/([\d.]+)/i },
  { name: 'Vivaldi', pattern: /Vivaldi\/([\d.]+)/i },
  { name: 'Thorium', pattern: /Thorium\/([\d.]+)/i },

  { name: 'YaBrowser', pattern: /YaBrowser\/([\d.]+)/i },
  { name: 'CocCoc', pattern: /coc_coc_browser\/([\d.]+)/i },

  { name: 'Maxthon', pattern: /Maxthon\/([\d.]+)/i },
  { name: 'Comodo Dragon', pattern: /Dragon\/([\d.]+)/i },

  { name: 'Whale', pattern: /Whale\/([\d.]+)/i },
  { name: 'Puffin', pattern: /Puffin\/([\d.]+)/i },

  // Mobile browsers
  { name: 'Samsung Browser', pattern: /SamsungBrowser\/([\d.]+)/i },
  { name: 'Huawei Browser', pattern: /HuaweiBrowser\/([\d.]+)/i },
  { name: 'Miui Browser', pattern: /MiuiBrowser\/([\d.]+)/i },

  { name: 'UCBrowser', pattern: /UCBrowser\/([\d.]+)/i },
  { name: 'QQBrowser', pattern: /QQBrowser\/([\d.]+)/i },
  { name: 'Sogou', pattern: /SogouMobileBrowser/i },

  { name: 'DuckDuckGo', pattern: /DuckDuckGo\/([\d.]+)/i },

  // Firefox family
  { name: 'Firefox', pattern: /Firefox\/([\d.]+)/i },
  { name: 'Waterfox', pattern: /Waterfox\/([\d.]+)/i },
  { name: 'Pale Moon', pattern: /PaleMoon\/([\d.]+)/i },
  { name: 'SeaMonkey', pattern: /SeaMonkey\/([\d.]+)/i },

  // Chrome family
  { name: 'Chrome', pattern: /CriOS\/([\d.]+)/i },
  { name: 'Chrome', pattern: /Chrome\/([\d.]+)/i },
  { name: 'Chromium', pattern: /Chromium\/([\d.]+)/i },

  // Safari
  { name: 'Safari', pattern: /Version\/([\d.]+).*Safari/i },

  // Legacy
  { name: 'MSIE', pattern: /MSIE ([\d.]+)/i },
  { name: 'IE', pattern: /Trident\/.*rv:([\d.]+)/i },
]

const OS_RULES: readonly IOsRule[] = [
  { name: 'Bot', pattern: /bot|crawl|spider|slurp|crawler/i, type: 'bot' },

  // TVs
  { name: 'Android TV', pattern: /Android TV/i, type: 'tv' },
  { name: 'Tizen', pattern: /Tizen/i, type: 'tv' },
  { name: 'WebOS', pattern: /webOS/i, type: 'tv' },
  { name: 'SmartTV', pattern: /SmartTV|SMART-TV/i, type: 'tv' },

  { name: 'PlayStation', pattern: /PlayStation/i, type: 'tv' },
  { name: 'Xbox', pattern: /Xbox/i, type: 'tv' },
  { name: 'Nintendo', pattern: /Nintendo/i, type: 'tv' },

  // Mobile OS
  { name: 'HarmonyOS', pattern: /HarmonyOS/i, type: 'mobile' },
  { name: 'KaiOS', pattern: /KaiOS/i, type: 'mobile' },

  { name: 'FireOS', pattern: /KF[A-Z]{2,}/i, type: 'tablet' },

  { name: 'iPadOS', pattern: /iPad/i, type: 'tablet' },
  { name: 'Android', pattern: /Android(?!.*Mobile)/i, type: 'tablet' },

  { name: 'iOS', pattern: /iPhone|iPod/i, type: 'mobile' },
  { name: 'Android', pattern: /Android.*Mobile/i, type: 'mobile' },

  { name: 'Windows Phone', pattern: /Windows Phone|IEMobile/i, type: 'mobile' },

  { name: 'BlackBerry', pattern: /BlackBerry|BB10/i, type: 'mobile' },

  // Desktop
  { name: 'Windows', pattern: /Windows NT/i, type: 'desktop' },
  { name: 'macOS', pattern: /Macintosh|Mac OS X/i, type: 'desktop' },
  { name: 'ChromeOS', pattern: /CrOS/i, type: 'desktop' },

  { name: 'Ubuntu', pattern: /Ubuntu/i, type: 'desktop' },
  { name: 'Debian', pattern: /Debian/i, type: 'desktop' },
  { name: 'Fedora', pattern: /Fedora/i, type: 'desktop' },
  { name: 'Arch', pattern: /Arch Linux/i, type: 'desktop' },

  { name: 'Linux', pattern: /Linux/i, type: 'desktop' }
]

const cache = new LRUCache<string, IUAResult>(512)

export const parseUA = (ua?: string | null): IUAResult => {
  if (!ua) {
    return {
      browser: { name: UNKNOWN, version: '' },
      os: { name: UNKNOWN, type: UNKNOWN },
      raw: ua,
    }
  }

  const cached = cache.get(ua)
  if (cached) return cached

  let browserName = UNKNOWN
  let browserVersion = ''

  for (const rule of BROWSER_RULES) {
    const match = rule.pattern.exec(ua)
    if (match) {
      browserName = rule.name
      browserVersion = match[1] ?? ''
      break
    }
  }

  let osName = UNKNOWN
  let osType: OsType = UNKNOWN

  for (const rule of OS_RULES) {
    if (rule.pattern.test(ua)) {
      osName = rule.name
      osType = rule.type
      break
    }
  }

  const result: IUAResult = {
    browser: { name: browserName, version: browserVersion },
    os: { name: osName, type: osType },
    raw: ua,
  }

  cache.set(ua, result)
  return result
}

export const isBot = (ua: string) => parseUA(ua).os.type == 'bot'
export const isMobile = (ua: string) => parseUA(ua).os.type == 'mobile'
export const isTablet = (ua: string) => parseUA(ua).os.type == 'tablet'
export const isDesktop = (ua: string) => parseUA(ua).os.type == 'desktop'
