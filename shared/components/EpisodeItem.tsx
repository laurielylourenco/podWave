import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import type { Episode } from '@/shared/types/podcast'

interface Props {
  episode: Episode
  onPress: (episode: Episode) => void
}

function formatDuration(seconds: number): string {
  if (!seconds) return ''
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}min`
  return `${m}min`
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export function EpisodeItem({ episode, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={() => onPress(episode)}
    >
      {episode.imageUrl ? (
        <Image source={{ uri: episode.imageUrl }} style={styles.artwork} />
      ) : (
        <View style={[styles.artwork, styles.artworkPlaceholder]}>
          <Text style={styles.placeholderText}>🎵</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {episode.title}
        </Text>
        <View style={styles.meta}>
          {episode.publishedAt ? (
            <Text style={styles.metaText}>{formatDate(episode.publishedAt)}</Text>
          ) : null}
          {episode.duration > 0 ? (
            <Text style={styles.metaText}> · {formatDuration(episode.duration)}</Text>
          ) : null}
        </View>
        {episode.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {episode.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2c2c2e',
    gap: 12,
  },
  rowPressed: {
    backgroundColor: '#1c1c1e',
  },
  artwork: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#2c2c2e',
    flexShrink: 0,
  },
  artworkPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 28,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  metaText: {
    color: '#636366',
    fontSize: 12,
  },
  description: {
    color: '#8e8e93',
    fontSize: 12,
    lineHeight: 17,
  },
})
