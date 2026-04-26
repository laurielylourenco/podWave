import { XMLParser } from 'fast-xml-parser'
import { Platform } from 'react-native'
import type { Episode } from '@/shared/types/podcast'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  allowBooleanAttributes: true,
  parseAttributeValue: false,
  isArray: (name) => name === 'item',
})

async function fetchXml(url: string, opts: { withHeaders: boolean }): Promise<string> {
  // Web: RSS normalmente falha por CORS. Proxy simples para permitir fetch do XML.
  const finalUrl = Platform.OS === 'web' ? `https://r.jina.ai/${url}` : url

  const response = await fetch(finalUrl, {
    headers: opts.withHeaders
      ? {
          // Alguns hosts rejeitam user-agent “desconhecido”; por isso existe fallback sem headers.
          Accept: 'application/rss+xml, application/xml, text/xml, */*',
          'User-Agent': 'Podwave/1.0 (podcast app)',
        }
      : undefined,
  })

  if (!response.ok) {
    throw new Error(`Falha ao carregar feed RSS: ${response.status}`)
  }

  const xml = await response.text()
  if (!xml || !xml.trim()) {
    throw new Error('Falha ao carregar feed RSS: resposta vazia')
  }
  return xml
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseDuration(raw: string | number | undefined): number {
  if (!raw) return 0
  if (typeof raw === 'number') return raw

  const str = String(raw).trim()

  // Formato HH:MM:SS ou MM:SS
  if (str.includes(':')) {
    const parts = str.split(':').map(Number)
    if (parts.length === 3) {
      const [h = 0, m = 0, s = 0] = parts
      return h * 3600 + m * 60 + s
    }
    if (parts.length === 2) {
      const [m = 0, s = 0] = parts
      return m * 60 + s
    }
  }

  const n = parseInt(str, 10)
  return isNaN(n) ? 0 : n
}

function parseDate(raw: string | undefined): string {
  if (!raw) return new Date().toISOString()
  try {
    return new Date(raw).toISOString()
  } catch {
    return new Date().toISOString()
  }
}

function getImageUrl(item: Record<string, unknown>, channelImage: string): string {
  const itunesImage = item['itunes:image'] as Record<string, string> | undefined
  if (itunesImage?.['@_href']) return itunesImage['@_href']

  const mediaThumbnail = item['media:thumbnail'] as Record<string, string> | undefined
  if (mediaThumbnail?.['@_url']) return mediaThumbnail['@_url']

  const mediaContent = item['media:content'] as Record<string, string> | undefined
  if (mediaContent?.['@_url'] && mediaContent['@_medium'] === 'image') {
    return mediaContent['@_url']
  }

  if (channelImage) return channelImage

  return ''
}

function getAudioUrl(item: Record<string, unknown>): string {
  const enclosure = item['enclosure'] as Record<string, string> | undefined
  if (enclosure?.['@_url']) {
    const type = enclosure['@_type'] ?? ''
    if (!type || type.includes('audio') || type.includes('mpeg') || type.includes('mp3')) {
      return enclosure['@_url']
    }
  }

  const mediaContent = item['media:content'] as Record<string, string> | undefined
  if (mediaContent?.['@_url'] && mediaContent['@_medium'] === 'audio') {
    return mediaContent['@_url']
  }

  return ''
}

function getGuid(item: Record<string, unknown>, index: number): string {
  const guid = item['guid']
  if (typeof guid === 'string') return guid
  if (typeof guid === 'object' && guid !== null) {
    const g = guid as Record<string, unknown>
    if (typeof g['#text'] === 'string') return g['#text']
  }
  return String(index)
}

export async function parseRssFeed(feedUrl: string): Promise<Episode[]> {
  const urlsToTry = [
    feedUrl,
    // Android pode bloquear cleartext http://; tenta https:// quando aplicável.
    feedUrl.startsWith('http://') ? `https://${feedUrl.slice('http://'.length)}` : null,
  ].filter(Boolean) as string[]

  let xml = ''
  let lastError: unknown

  for (const url of urlsToTry) {
    try {
      xml = await fetchXml(url, { withHeaders: true })
      break
    } catch (e) {
      lastError = e
    }

    try {
      xml = await fetchXml(url, { withHeaders: false })
      break
    } catch (e) {
      lastError = e
    }
  }

  if (!xml) {
    const msg = lastError instanceof Error ? lastError.message : 'erro desconhecido'
    throw new Error(`Falha ao carregar feed RSS: ${msg}`)
  }

  const result = parser.parse(xml)

  const channel = result?.rss?.channel ?? result?.feed ?? {}

  const channelImageUrl: string =
    (channel['itunes:image'] as Record<string, string>)?.['@_href'] ??
    (channel['image'] as Record<string, string>)?.url ??
    ''

  const channelTitle: string = String(channel.title ?? '')

  const items: Record<string, unknown>[] = Array.isArray(channel.item)
    ? channel.item
    : channel.item
      ? [channel.item as Record<string, unknown>]
      : []

  return items
    .map((item, index): Episode | null => {
      const audioUrl = getAudioUrl(item)
      if (!audioUrl) return null

      const title = String(item.title ?? `Episódio ${index + 1}`)
      const description = item.description
        ? stripHtml(String(item.description))
        : item['itunes:summary']
          ? stripHtml(String(item['itunes:summary']))
          : ''
      const duration = parseDuration(
        (item['itunes:duration'] as string | number | undefined) ?? undefined
      )
      const publishedAt = parseDate(item.pubDate as string | undefined)
      const imageUrl = getImageUrl(item, channelImageUrl)
      const guid = getGuid(item, index)

      return {
        id: guid,
        podcastId: '',
        podcastTitle: channelTitle,
        title,
        description,
        audioUrl,
        imageUrl,
        duration,
        publishedAt,
        isDownloaded: false,
      }
    })
    .filter((ep): ep is Episode => ep !== null)
}
