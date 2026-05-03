// Este módulo é executado em uma thread separada pelo react-native-track-player
// para responder a controles remotos (lock screen, notificação, fone de ouvido).
import TrackPlayer, { Event } from 'react-native-track-player';

export default async function playbackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => {
    TrackPlayer.seekTo(position);
  });

  TrackPlayer.addEventListener(Event.RemoteJumpForward, ({ interval }) => {
    TrackPlayer.getProgress().then(({ position }) =>
      TrackPlayer.seekTo(position + interval)
    );
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, ({ interval }) => {
    TrackPlayer.getProgress().then(({ position }) =>
      TrackPlayer.seekTo(Math.max(0, position - interval))
    );
  });

  TrackPlayer.addEventListener(Event.RemoteDuck, async ({ permanent, paused }) => {
    if (permanent) {
      await TrackPlayer.pause();
    } else if (paused) {
      await TrackPlayer.setVolume(0.5);
    } else {
      await TrackPlayer.setVolume(1);
    }
  });
}
