import { useEffect, useState } from 'react'
import TrackPlayer, { Event, State } from 'react-native-track-player'
import { usePlayerStore } from '@/store/playerStore'

export type PlayerStatus = 'playing' | 'paused' | 'buffering' | 'stopped' | 'loading'

function toPlayerStatus(state: State): PlayerStatus {
  switch (state) {
    case State.Playing:
      return 'playing'
    case State.Paused:
      return 'paused'
    case State.Buffering:
    case State.Loading:
      return 'buffering'
    default:
      return 'stopped'
  }
}

export function usePlayerState(): PlayerStatus {
  const [status, setStatus] = useState<PlayerStatus>('stopped')

  useEffect(() => {
    const sub = TrackPlayer.addEventListener(Event.PlaybackState, ({ state }) => {
      const ps = toPlayerStatus(state)
      setStatus(ps)
      usePlayerStore.getState().setIsPlaying(ps === 'playing')
    })

    return () => sub.remove()
  }, [])

  return status
}
