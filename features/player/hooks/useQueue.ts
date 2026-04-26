import { usePlayerStore } from '@/store/playerStore'
import type { Episode } from '@/shared/types/podcast'
import { episodeToTrack } from '@/features/player/utils/episodeToTrack'
import * as playerActions from '@/features/player/services/playerActions'
import { loadTrackPlayer } from '@/features/player/services/trackPlayerLoader'

export function useQueue() {
  const queue = usePlayerStore((s) => s.queue)
  const currentEpisode = usePlayerStore((s) => s.currentEpisode)
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue)
  const reorderQueue = usePlayerStore((s) => s.reorderQueue)
  const clearQueue = usePlayerStore((s) => s.clearQueue)

  async function addToQueue(episode: Episode) {
    await playerActions.addToQueue(episode)
  }

  async function playNext(episode: Episode) {
    const store = usePlayerStore.getState()
    const current = store.currentEpisode
    const currentIndex = current
      ? store.queue.findIndex((e) => e.id === current.id)
      : -1

    store.addToQueue(episode)

    // Move para logo após o atual
    const newIndex = store.queue.length - 1
    const targetIndex = currentIndex + 1
    if (newIndex !== targetIndex) {
      store.reorderQueue(newIndex, targetIndex)
    }

    const loaded = await loadTrackPlayer()
    if (loaded?.TrackPlayer && loaded.State) {
      const state = await loaded.TrackPlayer.getState()
      if (state !== loaded.State.None && state !== loaded.State.Stopped) {
        await loaded.TrackPlayer.add(episodeToTrack(episode), targetIndex)
      }
    }
  }

  async function handleRemove(episodeId: string) {
    removeFromQueue(episodeId)
  }

  async function handleReorder(from: number, to: number) {
    reorderQueue(from, to)
    // Sincroniza no player nativo: remove e re-insere na nova posição
    try {
      const loaded = await loadTrackPlayer()
      if (!loaded?.TrackPlayer) return

      await loaded.TrackPlayer.remove(from)
      const store = usePlayerStore.getState()
      const movedEpisode = store.queue[to]
      if (movedEpisode) {
        await loaded.TrackPlayer.add(episodeToTrack(movedEpisode), to)
      }
    } catch {
      // Player pode não ter track nessa posição
    }
  }

  return {
    queue,
    currentEpisode,
    addToQueue,
    playNext,
    removeFromQueue: handleRemove,
    reorderQueue: handleReorder,
    clearQueue,
  }
}
