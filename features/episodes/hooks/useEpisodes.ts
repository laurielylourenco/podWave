import { useQuery } from '@tanstack/react-query'
import { getEpisodes } from '@/features/podcasts/api/podcastIndex'

export function useEpisodes(feedId: string) {
  return useQuery({
    queryKey: ['episodes', feedId],
    queryFn: () => getEpisodes(feedId),
    enabled: !!feedId,
    staleTime: 10 * 60 * 1000,
  })
}
