import { useSubscriptionsStore } from '../subscriptionsStore'
import type { Podcast } from '@/shared/types/podcast'

function makePodcast(overrides: Partial<Podcast> = {}): Podcast {
  return {
    id: '1',
    title: 'Flow Podcast',
    author: 'Estúdios Flow',
    description: 'Bate-papo sem firulas',
    imageUrl: 'https://example.com/cover.jpg',
    feedUrl: 'https://example.com/feed.xml',
    categories: ['Comédia'],
    episodeCount: 100,
    ...overrides,
  }
}

describe('subscriptionsStore', () => {
  beforeEach(() => {
    useSubscriptionsStore.setState({ subscriptions: [] })
  })

  it('inicia sem assinaturas', () => {
    expect(useSubscriptionsStore.getState().subscriptions).toEqual([])
  })

  it('adiciona um podcast com subscribe', () => {
    const podcast = makePodcast()
    useSubscriptionsStore.getState().subscribe(podcast)

    expect(useSubscriptionsStore.getState().subscriptions).toHaveLength(1)
    expect(useSubscriptionsStore.getState().isSubscribed('1')).toBe(true)
  })

  it('remove um podcast com unsubscribe', () => {
    const podcast = makePodcast()
    useSubscriptionsStore.getState().subscribe(podcast)
    useSubscriptionsStore.getState().unsubscribe('1')

    expect(useSubscriptionsStore.getState().subscriptions).toHaveLength(0)
    expect(useSubscriptionsStore.getState().isSubscribed('1')).toBe(false)
  })

  it('isSubscribed retorna false para id inexistente', () => {
    expect(useSubscriptionsStore.getState().isSubscribed('999')).toBe(false)
  })

  it('mantém outras assinaturas ao remover uma específica', () => {
    const a = makePodcast({ id: '1' })
    const b = makePodcast({ id: '2', title: 'Outro Podcast' })

    useSubscriptionsStore.getState().subscribe(a)
    useSubscriptionsStore.getState().subscribe(b)
    useSubscriptionsStore.getState().unsubscribe('1')

    const subs = useSubscriptionsStore.getState().subscriptions
    expect(subs).toHaveLength(1)
    expect(subs[0].id).toBe('2')
  })
})
