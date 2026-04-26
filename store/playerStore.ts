import { create } from 'zustand'
import type { Episode } from '@/shared/types/podcast'

interface PlayerState {
  currentEpisode: Episode | null
  queue: Episode[]
  isPlaying: boolean
  position: number
  duration: number
  speed: number
  sleepTimerMinutes: number | null

  setCurrentEpisode: (episode: Episode) => void
  setIsPlaying: (playing: boolean) => void
  setPosition: (position: number) => void
  setDuration: (duration: number) => void
  setSpeed: (speed: number) => void
  setSleepTimer: (minutes: number | null) => void
  addToQueue: (episode: Episode) => void
  removeFromQueue: (episodeId: string) => void
  reorderQueue: (from: number, to: number) => void
  clearQueue: () => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentEpisode: null,
  queue: [],
  isPlaying: false,
  position: 0,
  duration: 0,
  speed: 1,
  sleepTimerMinutes: null,

  setCurrentEpisode: (episode) => set({ currentEpisode: episode }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPosition: (position) => set({ position }),
  setDuration: (duration) => set({ duration }),
  setSpeed: (speed) => set({ speed }),
  setSleepTimer: (sleepTimerMinutes) => set({ sleepTimerMinutes }),

  addToQueue: (episode) =>
    set((state) => ({ queue: [...state.queue, episode] })),

  removeFromQueue: (episodeId) =>
    set((state) => ({
      queue: state.queue.filter((e) => e.id !== episodeId),
    })),

  reorderQueue: (from, to) =>
    set((state) => {
      const queue = [...state.queue]
      const [moved] = queue.splice(from, 1)
      queue.splice(to, 0, moved)
      return { queue }
    }),

  clearQueue: () => set({ queue: [] }),
}))
