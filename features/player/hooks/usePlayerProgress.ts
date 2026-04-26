import { useEffect, useState } from 'react'
import TrackPlayer, { Event } from 'react-native-track-player'
import { usePlayerStore } from '@/store/playerStore'

interface PlayerProgress {
  position: number
  duration: number
  progress: number
}

export function usePlayerProgress(): PlayerProgress {
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const sub = TrackPlayer.addEventListener(
      Event.PlaybackProgressUpdated,
      ({ position: pos, duration: dur }) => {
        setPosition(pos)
        setDuration(dur)
        usePlayerStore.getState().setPosition(pos)
        usePlayerStore.getState().setDuration(dur)
      }
    )

    return () => sub.remove()
  }, [])

  const progress = duration > 0 ? position / duration : 0

  return { position, duration, progress }
}
