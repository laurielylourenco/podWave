import { useQuery } from '@tanstack/react-query'
import { getEpisodesByFeedId, getEpisodesByFeedUrl } from '@/features/podcasts/api/podcastIndex'

export function useEpisodes(params: { feedId?: string; feedUrl?: string }) {
  const feedId = params.feedId?.trim()
  const feedUrl = params.feedUrl?.trim()

  return useQuery({
    queryKey: ['episodes', feedId ?? null, feedUrl ?? null],
    queryFn: () => {
      if (feedUrl) return getEpisodesByFeedUrl(feedUrl)
      if (feedId) return getEpisodesByFeedId(feedId)
      return Promise.resolve([])
    },
    enabled: Boolean(feedUrl || feedId),
    staleTime: 10 * 60 * 1000,
  })
}
