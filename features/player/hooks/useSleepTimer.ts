import { useEffect, useRef, useState } from 'react'
import TrackPlayer from 'react-native-track-player'
import { usePlayerStore } from '@/store/playerStore'

interface SleepTimerResult {
  timeRemaining: number | null
  isActive: boolean
  setTimer: (minutes: number | null) => void
  clearTimer: () => void
}

export function useSleepTimer(): SleepTimerResult {
  const sleepTimerMinutes = usePlayerStore((s) => s.sleepTimerMinutes)
  const setSleepTimer = usePlayerStore((s) => s.setSleepTimer)

  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const endTimeRef = useRef<number | null>(null)

  function clearTimer() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
    timeoutRef.current = null
    intervalRef.current = null
    endTimeRef.current = null
    setTimeRemaining(null)
    setSleepTimer(null)
  }

  function setTimer(minutes: number | null) {
    clearTimer()
    if (minutes === null) return

    const ms = minutes * 60 * 1000
    const endTime = Date.now() + ms
    endTimeRef.current = endTime
    setSleepTimer(minutes)
    setTimeRemaining(ms / 1000)

    intervalRef.current = setInterval(() => {
      const remaining = Math.max(0, (endTimeRef.current ?? 0) - Date.now()) / 1000
      setTimeRemaining(remaining)
      if (remaining <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }, 1000)

    timeoutRef.current = setTimeout(async () => {
      await TrackPlayer.pause()
      clearTimer()
    }, ms)
  }

  // Restaura timer após remount se havia um ativo
  useEffect(() => {
    if (sleepTimerMinutes !== null && timeRemaining === null) {
      setTimer(sleepTimerMinutes)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return {
    timeRemaining,
    isActive: timeRemaining !== null && timeRemaining > 0,
    setTimer,
    clearTimer,
  }
}
