import { registerRootComponent } from 'expo';
import TrackPlayer from 'react-native-track-player';
import App from './App';

// Registrar o Playback Service ANTES do React inicializar
TrackPlayer.registerPlaybackService(() => require('./features/player/services/playbackService'));

registerRootComponent(App);
