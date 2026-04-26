import { useEffect, useState } from 'react'
import { usePlayerStore } from '@/store/playerStore'
import { loadTrackPlayer } from '@/features/player/services/trackPlayerLoader'

export type PlayerStatus = 'playing' | 'paused' | 'buffering' | 'stopped' | 'loading'

export function usePlayerState(): PlayerStatus {
  const [status, setStatus] = useState<PlayerStatus>('stopped')

  useEffect(() => {
    let remove: null | (() => void) = null

    void (async () => {
      const loaded = await loadTrackPlayer()
      if (!loaded?.TrackPlayer || !loaded.Event || !loaded.State) return

      const { TrackPlayer, Event, State } = loaded

      function mapState(s: unknown): PlayerStatus {
        if (s === State.Playing) return 'playing'
        if (s === State.Paused) return 'paused'
        if (s === State.Buffering || s === State.Loading) return 'buffering'
        return 'stopped'
      }

      const sub = TrackPlayer.addEventListener(Event.PlaybackState, ({ state }: { state: unknown }) => {
        const ps = mapState(state)
        setStatus(ps)
        usePlayerStore.getState().setIsPlaying(ps === 'playing')
      })

      remove = () => sub.remove()
    })()

    return () => remove?.()
  }, [])

  return status
}
