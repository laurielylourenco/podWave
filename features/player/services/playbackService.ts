// Este módulo é executado em uma thread separada pelo react-native-track-player
// para responder a controles remotos (lock screen, notificação, fone de ouvido).
export default async function playbackService() {
  const mod: any = await import('react-native-track-player')
  const TrackPlayer = mod.default ?? mod
  const { Event } = mod

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    void TrackPlayer.play()
  })

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    void TrackPlayer.pause()
  })

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    void TrackPlayer.skipToNext()
  })

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    void TrackPlayer.skipToPrevious()
  })

  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => {
    void TrackPlayer.seekTo(position)
  })

  TrackPlayer.addEventListener(Event.RemoteJumpForward, ({ interval }) => {
    void TrackPlayer.getProgress().then(({ position }) =>
      TrackPlayer.seekTo(position + interval)
    )
  })

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, ({ interval }) => {
    void TrackPlayer.getProgress().then(({ position }) =>
      TrackPlayer.seekTo(Math.max(0, position - interval))
    )
  })

  TrackPlayer.addEventListener(Event.RemoteDuck, async ({ permanent, paused }) => {
    if (permanent) {
      await TrackPlayer.pause()
    } else if (paused) {
      await TrackPlayer.setVolume(0.5)
    } else {
      await TrackPlayer.setVolume(1)
    }
  })
}
