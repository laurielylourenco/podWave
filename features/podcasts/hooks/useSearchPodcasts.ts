import { useQuery } from '@tanstack/react-query'
import { searchPodcasts } from '../api/podcastIndex'
import { searchPodcastsItunes } from '../api/itunes'

const hasPodcastIndexKeys =
  Boolean(process.env.EXPO_PUBLIC_PODCAST_INDEX_KEY) &&
  Boolean(process.env.EXPO_PUBLIC_PODCAST_INDEX_SECRET)

export function useSearchPodcasts(term: string) {
  const normalized = term.trim()
  const cacheTerm = normalized.toLowerCase()

  return useQuery({
    queryKey: ['podcasts', 'search', cacheTerm],
    queryFn: async () => {
      if (!normalized || normalized.length <= 2) return []

      if (hasPodcastIndexKeys) {
        try {
          return await searchPodcasts(normalized)
        } catch {
          return searchPodcastsItunes(normalized)
        }
      }

      return searchPodcastsItunes(normalized)
    },
    enabled: normalized.length > 2,
    staleTime: 5 * 60 * 1000,
  })
}
