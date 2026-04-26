import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import { PodcastCard } from '../PodcastCard'
import type { Podcast } from '@/shared/types/podcast'

const podcast: Podcast = {
  id: '1',
  title: 'Flow Podcast',
  author: 'Estúdios Flow',
  description: '',
  imageUrl: 'https://example.com/cover.jpg',
  feedUrl: 'https://example.com/feed.xml',
  categories: ['Comédia'],
  episodeCount: 100,
}

describe('<PodcastCard />', () => {
  it('exibe título, autor e contagem de episódios', () => {
    const { getByText } = render(
      <PodcastCard podcast={podcast} onPress={jest.fn()} />
    )

    expect(getByText('Flow Podcast')).toBeTruthy()
    expect(getByText('Estúdios Flow')).toBeTruthy()
    expect(getByText('100 ep.')).toBeTruthy()
  })

  it('oculta a contagem quando episodeCount é 0', () => {
    const { queryByText } = render(
      <PodcastCard
        podcast={{ ...podcast, episodeCount: 0 }}
        onPress={jest.fn()}
      />
    )
    expect(queryByText(/ep\./)).toBeNull()
  })

  it('mostra placeholder quando não há imageUrl', () => {
    const { getByText } = render(
      <PodcastCard
        podcast={{ ...podcast, imageUrl: '' }}
        onPress={jest.fn()}
      />
    )
    expect(getByText('🎙️')).toBeTruthy()
  })

  it('chama onPress com o podcast ao tocar no card', () => {
    const onPress = jest.fn()
    const { getByText } = render(
      <PodcastCard podcast={podcast} onPress={onPress} />
    )

    fireEvent.press(getByText('Flow Podcast'))

    expect(onPress).toHaveBeenCalledWith(podcast)
  })
})
