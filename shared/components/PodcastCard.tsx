import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import type { Podcast } from '@/shared/types/podcast'

interface Props {
  podcast: Podcast
  onPress: (podcast: Podcast) => void
}

export function PodcastCard({ podcast, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(podcast)}
    >
      {podcast.imageUrl ? (
        <Image source={{ uri: podcast.imageUrl }} style={styles.artwork} />
      ) : (
        <View style={[styles.artwork, styles.artworkPlaceholder]}>
          <Text style={styles.placeholderText}>🎙️</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {podcast.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {podcast.author}
        </Text>
        {podcast.episodeCount > 0 && (
          <Text style={styles.episodes}>{podcast.episodeCount} ep.</Text>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    backgroundColor: '#1c1c1e',
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  artwork: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#2c2c2e',
  },
  artworkPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 40,
  },
  info: {
    padding: 10,
  },
  title: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 3,
  },
  author: {
    color: '#8e8e93',
    fontSize: 11,
    marginBottom: 2,
  },
  episodes: {
    color: '#636366',
    fontSize: 10,
  },
})
