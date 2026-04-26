import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Podcast } from '@/shared/types/podcast'
import { mmkvZustandStorage } from '@/shared/storage/mmkv'

interface SubscriptionsState {
  subscriptions: Podcast[]
  isSubscribed: (podcastId: string) => boolean
  subscribe: (podcast: Podcast) => void
  unsubscribe: (podcastId: string) => void
}

export const useSubscriptionsStore = create<SubscriptionsState>()(
  persist(
    (set, get) => ({
      subscriptions: [],

      isSubscribed: (podcastId) => get().subscriptions.some((p) => p.id === podcastId),

      subscribe: (podcast) =>
        set((state) => {
          const exists = state.subscriptions.some((p) => p.id === podcast.id)
          if (exists) return state
          return { subscriptions: [...state.subscriptions, podcast] }
        }),

      unsubscribe: (podcastId) =>
        set((state) => ({
          subscriptions: state.subscriptions.filter((p) => p.id !== podcastId),
        })),
    }),
    {
      name: 'subscriptions-store',
      storage: mmkvZustandStorage,
      partialize: (state) => ({ subscriptions: state.subscriptions }),
    }
  )
)
