import type { Podcast, Episode } from '@/shared/types/podcast'

const BASE_URL = 'https://api.podcastindex.org/api/1.0'

const API_KEY = process.env.EXPO_PUBLIC_PODCAST_INDEX_KEY ?? ''
const API_SECRET = process.env.EXPO_PUBLIC_PODCAST_INDEX_SECRET ?? ''

async function sha1Hex(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function buildHeaders(): Promise<HeadersInit> {
  const authDate = Math.floor(Date.now() / 1000).toString()
  const hash = await sha1Hex(`${API_KEY}${API_SECRET}${authDate}`)

  return {
    'X-Auth-Key': API_KEY,
    'X-Auth-Date': authDate,
    Authorization: hash,
    'User-Agent': 'Podwave/1.0',
  }
}

export async function searchPodcasts(term: string): Promise<Podcast[]> {
  const response = await fetch(
    `${BASE_URL}/search/byterm?q=${encodeURIComponent(term)}&max=20`,
    { headers: await buildHeaders() }
  )

  if (!response.ok) throw new Error('Falha na busca de podcasts')

  const data = await response.json()

  return (data.feeds ?? []).map(
    (feed: Record<string, unknown>): Podcast => ({
      id: String(feed.id),
      title: String(feed.title ?? ''),
      author: String(feed.author ?? ''),
      description: String(feed.description ?? ''),
      imageUrl: String(feed.image ?? ''),
      feedUrl: String(feed.url ?? ''),
      categories: Object.values((feed.categories as Record<string, string>) ?? {}).slice(0, 3),
      episodeCount: Number(feed.episodeCount ?? 0),
    })
  )
}

export async function getEpisodes(feedId: string): Promise<Episode[]> {
  const response = await fetch(
    `${BASE_URL}/episodes/byfeedid?id=${feedId}&max=50`,
    { headers: await buildHeaders() }
  )

  if (!response.ok) throw new Error('Falha ao buscar episódios')

  const data = await response.json()

  return (data.items ?? []).map(
    (item: Record<string, unknown>): Episode => ({
      id: String(item.id),
      podcastId: feedId,
      podcastTitle: String(item.feedTitle ?? ''),
      title: String(item.title ?? ''),
      description: String(item.description ?? ''),
      audioUrl: String(item.enclosureUrl ?? ''),
      imageUrl: String(item.image ?? item.feedImage ?? ''),
      duration: Number(item.duration ?? 0),
      publishedAt: new Date(Number(item.datePublished ?? 0) * 1000).toISOString(),
      isDownloaded: false,
    })
  )
}
