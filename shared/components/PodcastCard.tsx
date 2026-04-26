import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Radius, Spacing, Typography } from '@/shared/theme'
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
          <Ionicons name="mic-outline" size={36} color={Colors.medGrey} />
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
    borderRadius: Radius.lg,
    backgroundColor: Colors.cardBg,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  artwork: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.surfaceBg,
  },
  artworkPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  title: {
    ...Typography.bodySm,
    color: Colors.dustGrey,
    fontWeight: '600',
    lineHeight: 19,
  },
  author: {
    ...Typography.caption,
    color: Colors.drySage,
  },
  episodes: {
    ...Typography.caption,
    color: Colors.fern,
  },
})
