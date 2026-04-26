// Stub para plataforma web — react-native-track-player não suporta web sem shaka-player
const noop = () => Promise.resolve()
const noopSync = () => {}

const TrackPlayer = {
  setupPlayer: noop,
  updateOptions: noop,
  add: noop,
  reset: noop,
  play: noop,
  pause: noop,
  stop: noop,
  seekTo: noop,
  skipToNext: noop,
  skipToPrevious: noop,
  remove: noop,
  setRate: noop,
  setVolume: noop,
  setRepeatMode: noop,
  getState: () => Promise.resolve(0),
  getProgress: () => Promise.resolve({ position: 0, duration: 0, buffered: 0 }),
  registerPlaybackService: noopSync,
  addEventListener: () => ({ remove: noopSync }),
}

export default TrackPlayer

export const Event = {
  PlaybackState: 'playback-state',
  PlaybackProgressUpdated: 'playback-progress-updated',
  PlaybackError: 'playback-error',
  RemotePlay: 'remote-play',
  RemotePause: 'remote-pause',
  RemoteNext: 'remote-next',
  RemotePrevious: 'remote-previous',
  RemoteSeek: 'remote-seek',
  RemoteJumpForward: 'remote-jump-forward',
  RemoteJumpBackward: 'remote-jump-backward',
  RemoteDuck: 'remote-duck',
}

export const State = {
  None: 0,
  Stopped: 1,
  Paused: 2,
  Playing: 3,
  Buffering: 6,
  Loading: 7,
}

export const Capability = {
  Play: 0,
  Pause: 1,
  Stop: 2,
  SeekTo: 9,
  SkipToNext: 3,
  SkipToPrevious: 4,
  JumpForward: 10,
  JumpBackward: 11,
}

export const RepeatMode = {
  Off: 0,
  Track: 1,
  Queue: 2,
}
