import { useEffect, useState } from 'react'
import { usePlayerStore } from '@/store/playerStore'
import { loadTrackPlayer } from '@/features/player/services/trackPlayerLoader'

interface PlayerProgress {
  position: number
  duration: number
  progress: number
}

export function usePlayerProgress(): PlayerProgress {
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    let remove: null | (() => void) = null

    void (async () => {
      const loaded = await loadTrackPlayer()
      if (!loaded?.TrackPlayer || !loaded.Event) return

      const sub = loaded.TrackPlayer.addEventListener(
        loaded.Event.PlaybackProgressUpdated,
        ({ position: pos, duration: dur }: { position: number; duration: number }) => {
          setPosition(pos)
          setDuration(dur)
          usePlayerStore.getState().setPosition(pos)
          usePlayerStore.getState().setDuration(dur)
        }
      )

      remove = () => sub.remove()
    })()

    return () => remove?.()
  }, [])

  const progress = duration > 0 ? position / duration : 0

  return { position, duration, progress }
}
