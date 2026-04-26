import { create } from 'zustand'
import type { Podcast } from '@/shared/types/podcast'

interface SubscriptionsState {
  subscriptions: Podcast[]
  isSubscribed: (podcastId: string) => boolean
  subscribe: (podcast: Podcast) => void
  unsubscribe: (podcastId: string) => void
}

export const useSubscriptionsStore = create<SubscriptionsState>((set, get) => ({
  subscriptions: [],

  isSubscribed: (podcastId) =>
    get().subscriptions.some((p) => p.id === podcastId),

  subscribe: (podcast) =>
    set((state) => ({
      subscriptions: [...state.subscriptions, podcast],
    })),

  unsubscribe: (podcastId) =>
    set((state) => ({
      subscriptions: state.subscriptions.filter((p) => p.id !== podcastId),
    })),
}))
