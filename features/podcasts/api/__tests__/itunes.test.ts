import { searchPodcastsItunes } from '../itunes'

describe('searchPodcastsItunes', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('mapeia o retorno da API para o tipo Podcast', async () => {
    const mockResponse = {
      results: [
        {
          collectionId: 12345,
          collectionName: 'Flow Podcast',
          artistName: 'Estúdios Flow',
          artworkUrl600: 'https://example.com/600.jpg',
          artworkUrl100: 'https://example.com/100.jpg',
          feedUrl: 'https://example.com/feed.xml',
          primaryGenreName: 'Comédia',
          trackCount: 50,
        },
      ],
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    }) as unknown as typeof fetch

    const result = await searchPodcastsItunes('flow')

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('itunes.apple.com/search?term=flow')
    )
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: '12345',
      title: 'Flow Podcast',
      author: 'Estúdios Flow',
      description: '',
      imageUrl: 'https://example.com/600.jpg',
      feedUrl: 'https://example.com/feed.xml',
      categories: ['Comédia'],
      episodeCount: 50,
    })
  })

  it('faz fallback para artworkUrl100 quando 600 não existe', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            collectionId: 1,
            collectionName: 'X',
            artistName: 'Y',
            artworkUrl100: 'https://example.com/small.jpg',
          },
        ],
      }),
    }) as unknown as typeof fetch

    const result = await searchPodcastsItunes('x')
    expect(result[0].imageUrl).toBe('https://example.com/small.jpg')
  })

  it('retorna lista vazia quando results é ausente', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    }) as unknown as typeof fetch

    const result = await searchPodcastsItunes('vazio')
    expect(result).toEqual([])
  })

  it('lança erro quando a resposta não é OK', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    }) as unknown as typeof fetch

    await expect(searchPodcastsItunes('falha')).rejects.toThrow(
      'Falha na busca iTunes'
    )
  })

  it('codifica o termo na URL', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    }) as unknown as typeof fetch

    await searchPodcastsItunes('café & história')

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('caf%C3%A9%20%26%20hist%C3%B3ria')
    )
  })
})
