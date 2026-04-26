import { useQuery } from '@tanstack/react-query'
import { searchPodcasts } from '../api/podcastIndex'
import { searchPodcastsItunes } from '../api/itunes'

export function useSearchPodcasts(term: string) {
  return useQuery({
    queryKey: ['podcasts', 'search', term],
    queryFn: async () => {
      try {
        return await searchPodcasts(term)
      } catch {
        return searchPodcastsItunes(term)
      }
    },
    enabled: term.trim().length > 2,
    staleTime: 5 * 60 * 1000,
  })
}
