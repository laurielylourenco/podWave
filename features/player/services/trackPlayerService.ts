import TrackPlayer, { Capability, RepeatMode } from 'react-native-track-player'

let isSetup = false

export async function setupPlayer(): Promise<boolean> {
  if (isSetup) return true

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
