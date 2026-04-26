import { Platform } from 'react-native'
import Constants from 'expo-constants'

export type TrackPlayerModule = {
  TrackPlayer: any
  Event?: any
  State?: any
  Capability?: any
  RepeatMode?: any
}

function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo'
}

export async function loadTrackPlayer(): Promise<TrackPlayerModule | null> {
  if (Platform.OS === 'web') return null
  if (isExpoGo()) return null

  try {
    const mod: any = await import('react-native-track-player')
    const TrackPlayer = mod.default ?? mod

    return {
      TrackPlayer,
      Event: mod.Event,
      State: mod.State,
      Capability: mod.Capability,
      RepeatMode: mod.RepeatMode,
    }
  } catch {
    return null
  }
}

