import { searchPodcasts, getEpisodesByFeedId, getEpisodesByFeedUrl } from '../podcastIndex'

describe('podcastIndex API', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  describe('searchPodcasts', () => {
    it('mapeia feeds para o tipo Podcast', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          feeds: [
            {
              id: 999,
              title: 'Naruhodo',
              author: 'Ken Fujioka',
              description: 'Podcast de ciência',
              image: 'https://example.com/cover.jpg',
              url: 'https://example.com/feed.xml',
              categories: { '1': 'Ciência', '2': 'Educação' },
              episodeCount: 200,
            },
          ],
        }),
      }) as unknown as typeof fetch

      const result = await searchPodcasts('naruhodo')

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        id: '999',
        title: 'Naruhodo',
        author: 'Ken Fujioka',
        description: 'Podcast de ciência',
        imageUrl: 'https://example.com/cover.jpg',
        feedUrl: 'https://example.com/feed.xml',
        categories: ['Ciência', 'Educação'],
        episodeCount: 200,
      })
    })

    it('limita categorias a 3 itens', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          feeds: [
            {
              id: 1,
              categories: { a: '1', b: '2', c: '3', d: '4', e: '5' },
            },
          ],
        }),
      }) as unknown as typeof fetch

      const result = await searchPodcasts('x')
      expect(result[0].categories).toHaveLength(3)
    })

    it('envia headers de autenticação do Podcast Index', async () => {
      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ feeds: [] }),
      })
      global.fetch = fetchMock as unknown as typeof fetch

      await searchPodcasts('test')

      const [, options] = fetchMock.mock.calls[0]
      expect(options.headers).toMatchObject({
        'X-Auth-Key': 'test-key',
        'User-Agent': 'Podwave/1.0',
      })
      expect(options.headers['X-Auth-Date']).toMatch(/^\d+$/)
      expect(options.headers.Authorization).toMatch(/^[a-f0-9]{40}$/)
    })

    it('lança erro quando a resposta não é OK', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({}),
      }) as unknown as typeof fetch

      await expect(searchPodcasts('falha')).rejects.toThrow(
        'Falha na busca de podcasts'
      )
    })
  })

  describe('getEpisodesByFeedId', () => {
    it('mapeia items para o tipo Episode', async () => {
      const datePublished = 1735689600
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 555,
              title: 'Episódio piloto',
              description: 'Resumo',
              enclosureUrl: 'https://example.com/audio.mp3',
              image: 'https://example.com/ep.jpg',
              feedImage: 'https://example.com/feed.jpg',
              feedTitle: 'Show X',
              duration: 1800,
              datePublished,
            },
          ],
        }),
      }) as unknown as typeof fetch

      const result = await getEpisodesByFeedId('123')

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        id: '555',
        podcastId: '123',
        podcastTitle: 'Show X',
        title: 'Episódio piloto',
        description: 'Resumo',
        audioUrl: 'https://example.com/audio.mp3',
        imageUrl: 'https://example.com/ep.jpg',
        duration: 1800,
        isDownloaded: false,
      })
      expect(result[0].publishedAt).toBe(
        new Date(datePublished * 1000).toISOString()
      )
    })

    it('faz fallback para feedImage quando image não existe', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 1,
              feedImage: 'https://example.com/feed.jpg',
              datePublished: 0,
            },
          ],
        }),
      }) as unknown as typeof fetch

      const result = await getEpisodesByFeedId('1')
      expect(result[0].imageUrl).toBe('https://example.com/feed.jpg')
    })

    it('lança erro quando a resposta não é OK', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({}),
      }) as unknown as typeof fetch

      await expect(getEpisodesByFeedId('1')).rejects.toThrow('Falha ao buscar episódios')
    })
  })

  describe('getEpisodesByFeedUrl', () => {
    it('faz request usando o parâmetro url', async () => {
      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ items: [] }),
      })
      global.fetch = fetchMock as unknown as typeof fetch

      await getEpisodesByFeedUrl('https://example.com/feed.xml')

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/episodes/byfeedurl?url=https%3A%2F%2Fexample.com%2Ffeed.xml'),
        expect.any(Object)
      )
    })

    it('mapeia items e usa feedId quando presente', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 10,
              feedId: 999,
              feedTitle: 'Show Y',
              enclosureUrl: 'https://example.com/a.mp3',
              datePublished: 0,
            },
          ],
        }),
      }) as unknown as typeof fetch

      const result = await getEpisodesByFeedUrl('https://example.com/feed.xml')
      expect(result[0].podcastId).toBe('999')
      expect(result[0].podcastTitle).toBe('Show Y')
      expect(result[0].audioUrl).toBe('https://example.com/a.mp3')
    })
  })
})
