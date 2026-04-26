import type { Podcast } from '@/shared/types/podcast'

const BASE_URL = 'https://itunes.apple.com'

export async function searchPodcastsItunes(term: string): Promise<Podcast[]> {
  const response = await fetch(
    `${BASE_URL}/search?term=${encodeURIComponent(term)}&media=podcast&limit=20`
  )

  if (!response.ok) throw new Error('Falha na busca iTunes')

  const data = await response.json()

  return (data.results ?? []).map(
    (item: Record<string, unknown>): Podcast => ({
      id: String(item.collectionId),
      title: String(item.collectionName ?? ''),
      author: String(item.artistName ?? ''),
      description: '',
      imageUrl: String(item.artworkUrl600 ?? item.artworkUrl100 ?? ''),
      feedUrl: String(item.feedUrl ?? ''),
      categories: [String(item.primaryGenreName ?? '')],
      episodeCount: Number(item.trackCount ?? 0),
    })
  )
}
