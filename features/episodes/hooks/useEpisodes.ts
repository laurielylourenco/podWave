import { useQuery } from '@tanstack/react-query'
import { getEpisodesByFeedId, getEpisodesByFeedUrl } from '@/features/podcasts/api/podcastIndex'
import { parseRssFeed } from '@/features/episodes/api/rssParser'

const hasPodcastIndexKeys =
  Boolean(process.env.EXPO_PUBLIC_PODCAST_INDEX_KEY) &&
  Boolean(process.env.EXPO_PUBLIC_PODCAST_INDEX_SECRET)

export function useEpisodes(params: { feedId?: string; feedUrl?: string }) {
  const feedId = params.feedId?.trim()
  const feedUrl = params.feedUrl?.trim()

  return useQuery({
    queryKey: ['episodes', feedId ?? null, feedUrl ?? null],
    queryFn: async () => {
      // Estratégia: Podcast Index API → RSS direto → feedId sem URL
      if (feedUrl) {
        if (hasPodcastIndexKeys) {
          try {
            return await getEpisodesByFeedUrl(feedUrl)
          } catch {
            // Fallback para RSS
          }
        }
        return await parseRssFeed(feedUrl)
      }

      if (feedId) {
        if (hasPodcastIndexKeys) {
          return getEpisodesByFeedId(feedId)
        }
        throw new Error(
          'Sem URL do feed e sem chaves de API configuradas. Impossível carregar episódios.'
        )
      }

      return []
    },
    enabled: Boolean(feedUrl || feedId),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  })
}
