import { usePlayerStore } from '../playerStore'
import type { Episode } from '@/shared/types/podcast'

function makeEpisode(overrides: Partial<Episode> = {}): Episode {
  return {
    id: 'e1',
    podcastId: 'p1',
    podcastTitle: 'Podwave Show',
    title: 'Episódio 1',
    description: 'Descrição',
    audioUrl: 'https://example.com/audio.mp3',
    imageUrl: 'https://example.com/image.jpg',
    duration: 1800,
    publishedAt: '2026-01-01T00:00:00Z',
    isDownloaded: false,
    ...overrides,
  }
}

describe('playerStore', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      currentEpisode: null,
      queue: [],
      isPlaying: false,
      position: 0,
      duration: 0,
      speed: 1,
      sleepTimerMinutes: null,
    })
  })

  it('inicia com estado padrão', () => {
    const state = usePlayerStore.getState()
    expect(state.currentEpisode).toBeNull()
    expect(state.queue).toEqual([])
    expect(state.isPlaying).toBe(false)
    expect(state.speed).toBe(1)
  })

  it('define o episódio atual', () => {
    const episode = makeEpisode()
    usePlayerStore.getState().setCurrentEpisode(episode)
    expect(usePlayerStore.getState().currentEpisode).toEqual(episode)
  })

  it('alterna isPlaying, position e duration', () => {
    usePlayerStore.getState().setIsPlaying(true)
    usePlayerStore.getState().setPosition(120)
    usePlayerStore.getState().setDuration(1800)

    const state = usePlayerStore.getState()
    expect(state.isPlaying).toBe(true)
    expect(state.position).toBe(120)
    expect(state.duration).toBe(1800)
  })

  it('atualiza speed e sleepTimer', () => {
    usePlayerStore.getState().setSpeed(1.5)
    usePlayerStore.getState().setSleepTimer(30)

    expect(usePlayerStore.getState().speed).toBe(1.5)
    expect(usePlayerStore.getState().sleepTimerMinutes).toBe(30)
  })

  it('adiciona e remove episódios da fila', () => {
    const a = makeEpisode({ id: '1' })
    const b = makeEpisode({ id: '2' })

    usePlayerStore.getState().addToQueue(a)
    usePlayerStore.getState().addToQueue(b)
    expect(usePlayerStore.getState().queue).toHaveLength(2)

    usePlayerStore.getState().removeFromQueue('1')
    expect(usePlayerStore.getState().queue).toHaveLength(1)
    expect(usePlayerStore.getState().queue[0].id).toBe('2')
  })

  it('reordena a fila com reorderQueue', () => {
    const a = makeEpisode({ id: '1' })
    const b = makeEpisode({ id: '2' })
    const c = makeEpisode({ id: '3' })

    usePlayerStore.getState().addToQueue(a)
    usePlayerStore.getState().addToQueue(b)
    usePlayerStore.getState().addToQueue(c)

    usePlayerStore.getState().reorderQueue(0, 2)

    const ids = usePlayerStore.getState().queue.map((e) => e.id)
    expect(ids).toEqual(['2', '3', '1'])
  })

  it('limpa a fila com clearQueue', () => {
    usePlayerStore.getState().addToQueue(makeEpisode())
    usePlayerStore.getState().clearQueue()
    expect(usePlayerStore.getState().queue).toEqual([])
  })
})
