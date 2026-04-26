import { Platform } from 'react-native'
import Constants from 'expo-constants'

let isSetup = false

function isExpoGo(): boolean {
  // Expo Go não suporta módulos nativos custom (como react-native-track-player)
  return Constants.appOwnership === 'expo'
}

async function loadTrackPlayer(): Promise<null | {
  TrackPlayer: any
  Capability: any
  RepeatMode: any
}> {
  if (Platform.OS === 'web') return null
  if (isExpoGo()) return null

  try {
    const mod: any = await import('react-native-track-player')
    return {
      TrackPlayer: mod.default ?? mod,
      Capability: mod.Capability,
      RepeatMode: mod.RepeatMode,
    }
  } catch {
    return null
  }
}

export async function registerPlaybackService(
  factory: () => (typeof import('./playbackService')) | any
): Promise<void> {
  const loaded = await loadTrackPlayer()
  if (!loaded) return
  try {
    loaded.TrackPlayer.registerPlaybackService(factory)
  } catch (e) {
    console.warn('[TrackPlayer] registerPlaybackService error:', e)
  }
}

export async function setupPlayer(): Promise<boolean> {
  if (isSetup) return true

  const loaded = await loadTrackPlayer()
  if (!loaded) {
    // Não é erro: apenas indisponível (web/Expo Go/sem native module)
    return false
  }

  const { TrackPlayer, Capability, RepeatMode } = loaded

  try {
    await TrackPlayer.setupPlayer({
      maxCacheSize: 1024 * 5, // 5 MB de cache de áudio
    })

    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SeekTo,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.JumpForward,
        Capability.JumpBackward,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      progressUpdateEventThrottle: 1000,
      jumpInterval: 15,
      android: {
        appKilledPlaybackBehavior: 0, // ContinuePlayback
      },
    })

    await TrackPlayer.setRepeatMode(RepeatMode.Off)

    isSetup = true
    return true
  } catch (error) {
    // Pode lançar se já estiver configurado em hot reload
    if (error instanceof Error && error.message.includes('already been initialized')) {
      isSetup = true
      return true
    }
    console.warn('[TrackPlayer] setupPlayer error:', error)
    return false
  }
}
