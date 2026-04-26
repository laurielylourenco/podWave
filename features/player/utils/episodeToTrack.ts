import type { Track } from 'react-native-track-player'
import type { Episode } from '@/shared/types/podcast'

export function episodeToTrack(episode: Episode): Track {
  return {
    id: episode.id,
    url: episode.audioUrl,
    title: episode.title,
    artist: episode.podcastTitle,
    artwork: episode.imageUrl || undefined,
    duration: episode.duration || undefined,
  }
}
