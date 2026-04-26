import { usePlayerStore } from '@/store/playerStore'
import type { Episode } from '@/shared/types/podcast'
import { episodeToTrack } from '@/features/player/utils/episodeToTrack'
import { Platform } from 'react-native'
import Constants from 'expo-constants'

function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo'
}

async function loadTrackPlayer(): Promise<null | { TrackPlayer: any; State: any }> {
  if (Platform.OS === 'web') return null
  if (isExpoGo()) return null
  try {
    const mod: any = await import('react-native-track-player')
    return { TrackPlayer: mod.default ?? mod, State: mod.State }
  } catch {
    return null
  }
}

export async function playEpisode(episode: Episode): Promise<void> {
  const loaded = await loadTrackPlayer()
  if (!loaded) {
    console.warn('[TrackPlayer] indisponível (Expo Go/web).')
    return
  }
  const { TrackPlayer } = loaded
  const store = usePlayerStore.getState()
  const track = episodeToTrack(episode)

  await TrackPlayer.reset()
  await TrackPlayer.add(track)

  // Adiciona fila logo após o episódio atual
  const queue = store.queue.filter((e) => e.id !== episode.id)
  if (queue.length > 0) {
    await TrackPlayer.add(queue.map(episodeToTrack))
  }

  await TrackPlayer.play()
  store.setCurrentEpisode(episode)
  store.setIsPlaying(true)
}

export async function togglePlayPause(): Promise<void> {
  const loaded = await loadTrackPlayer()
  if (!loaded) return
  const { TrackPlayer, State } = loaded
  const state = await TrackPlayer.getState()
  const store = usePlayerStore.getState()

  if (state === State.Playing) {
    await TrackPlayer.pause()
    store.setIsPlaying(false)
  } else {
    await TrackPlayer.play()
    store.setIsPlaying(true)
  }
}

export async function seekForward(): Promise<void> {
  const loaded = await loadTrackPlayer()
  if (!loaded) return
  const { TrackPlayer } = loaded
  const { position } = await TrackPlayer.getProgress()
  await TrackPlayer.seekTo(position + 15)
}

export async function seekBackward(): Promise<void> {
  const loaded = await loadTrackPlayer()
  if (!loaded) return
  const { TrackPlayer } = loaded
  const { position } = await TrackPlayer.getProgress()
  await TrackPlayer.seekTo(Math.max(0, position - 15))
}

export async function seekTo(seconds: number): Promise<void> {
  const loaded = await loadTrackPlayer()
  if (!loaded) return
  const { TrackPlayer } = loaded
  await TrackPlayer.seekTo(seconds)
}

export async function setPlaybackSpeed(speed: number): Promise<void> {
  const loaded = await loadTrackPlayer()
  if (!loaded) return
  const { TrackPlayer } = loaded
  await TrackPlayer.setRate(speed)
  usePlayerStore.getState().setSpeed(speed)
}

export async function skipToNext(): Promise<void> {
  const loaded = await loadTrackPlayer()
  if (!loaded) return
  const { TrackPlayer } = loaded
  try {
    await TrackPlayer.skipToNext()
    const store = usePlayerStore.getState()
    const queue = store.queue
    const current = store.currentEpisode
    if (!current || queue.length === 0) return
    const currentIndex = queue.findIndex((e) => e.id === current.id)
    const next = queue[currentIndex + 1]
    if (next) store.setCurrentEpisode(next)
  } catch {
    // Fim da fila
  }
}

export async function skipToPrevious(): Promise<void> {
  const loaded = await loadTrackPlayer()
  if (!loaded) return
  const { TrackPlayer } = loaded
  try {
    await TrackPlayer.skipToPrevious()
    const store = usePlayerStore.getState()
    const queue = store.queue
    const current = store.currentEpisode
    if (!current || queue.length === 0) return
    const currentIndex = queue.findIndex((e) => e.id === current.id)
    const prev = queue[currentIndex - 1]
    if (prev) store.setCurrentEpisode(prev)
  } catch {
    // Início da fila
  }
}

export async function addToQueue(episode: Episode): Promise<void> {
  const loaded = await loadTrackPlayer()
  if (!loaded) {
    // Ainda assim mantém no store, para quando estiver em dev build.
    usePlayerStore.getState().addToQueue(episode)
    return
  }
  const { TrackPlayer, State } = loaded
  const store = usePlayerStore.getState()
  store.addToQueue(episode)

  // Adiciona ao queue nativo apenas se o player já está rodando
  const state = await TrackPlayer.getState()
  if (state !== State.None && state !== State.Stopped) {
    await TrackPlayer.add(episodeToTrack(episode))
  }
}

export async function stopPlayer(): Promise<void> {
  const loaded = await loadTrackPlayer()
  if (!loaded) return
  const { TrackPlayer } = loaded
  await TrackPlayer.reset()
  const store = usePlayerStore.getState()
  store.setIsPlaying(false)
  store.setPosition(0)
}
