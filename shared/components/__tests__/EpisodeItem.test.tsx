import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import { EpisodeItem } from '../EpisodeItem'
import type { Episode } from '@/shared/types/podcast'

const episode: Episode = {
  id: 'e1',
  podcastId: 'p1',
  podcastTitle: 'Podwave Show',
  title: 'Como gravamos o piloto',
  description: 'Por trás das câmeras',
  audioUrl: 'https://example.com/audio.mp3',
  imageUrl: 'https://example.com/ep.jpg',
  duration: 3725,
  publishedAt: '2026-01-15T12:00:00Z',
  isDownloaded: false,
}

describe('<EpisodeItem />', () => {
  it('exibe título e descrição', () => {
    const { getByText } = render(
      <EpisodeItem episode={episode} onPress={jest.fn()} />
    )
    expect(getByText('Como gravamos o piloto')).toBeTruthy()
    expect(getByText('Por trás das câmeras')).toBeTruthy()
  })

  it('formata duração em horas e minutos', () => {
    const { getByText } = render(
      <EpisodeItem episode={episode} onPress={jest.fn()} />
    )
    expect(getByText(/1h 2min/)).toBeTruthy()
  })

  it('formata duração em minutos quando menor que uma hora', () => {
    const { getByText } = render(
      <EpisodeItem
        episode={{ ...episode, duration: 1500 }}
        onPress={jest.fn()}
      />
    )
    expect(getByText(/25min/)).toBeTruthy()
  })

  it('mostra placeholder quando não há imagem', () => {
    const { getByText } = render(
      <EpisodeItem episode={{ ...episode, imageUrl: '' }} onPress={jest.fn()} />
    )
    expect(getByText('🎵')).toBeTruthy()
  })

  it('aciona onPress com o episódio', () => {
    const onPress = jest.fn()
    const { getByText } = render(
      <EpisodeItem episode={episode} onPress={onPress} />
    )

    fireEvent.press(getByText('Como gravamos o piloto'))

    expect(onPress).toHaveBeenCalledWith(episode)
  })
})
