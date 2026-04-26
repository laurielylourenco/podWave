export interface Podcast {
  id: string
  title: string
  author: string
  description: string
  imageUrl: string
  feedUrl: string
  categories: string[]
  episodeCount: number
}

export interface Episode {
  id: string
  podcastId: string
  podcastTitle: string
  title: string
  description: string
  audioUrl: string
  imageUrl: string
  duration: number
  publishedAt: string
  isDownloaded: boolean
}

export interface PlayerTrack {
  id: string
  url: string
  title: string
  artist: string
  artwork: string
  duration: number
}
