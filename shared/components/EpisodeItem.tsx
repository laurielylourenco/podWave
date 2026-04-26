import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Radius, Spacing, Typography } from '@/shared/theme'
import type { Episode } from '@/shared/types/podcast'

interface Props {
  episode: Episode
  onPress: (episode: Episode) => void
  isActive?: boolean
  isPlaying?: boolean
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

export function EpisodeItem({ episode, onPress, isActive = false, isPlaying = false }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        isActive && styles.rowActive,
        pressed && styles.rowPressed,
      ]}
      onPress={() => onPress(episode)}
    >
      {episode.imageUrl ? (
        <Image source={{ uri: episode.imageUrl }} style={styles.artwork} />
      ) : (
        <View style={[styles.artwork, styles.artworkPlaceholder]}>
          <Ionicons name="musical-note-outline" size={24} color={Colors.medGrey} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={[styles.title, isActive && styles.titleActive]} numberOfLines={2}>
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

      {isPlaying ? (
        <Ionicons name="volume-high" size={24} color={Colors.fern} style={styles.actionIcon} />
      ) : isActive ? (
        <Ionicons name="pause-circle-outline" size={32} color={Colors.fern} style={styles.actionIcon} />
      ) : (
        <Ionicons name="play-circle-outline" size={32} color={Colors.fern} style={styles.actionIcon} />
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: Spacing.md,
    alignItems: 'center',
  },
  rowActive: {
    backgroundColor: Colors.cardBg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.fern,
  },
  rowPressed: {
    backgroundColor: Colors.cardBg,
  },
  artwork: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
    backgroundColor: Colors.cardBg,
    flexShrink: 0,
  },
  artworkPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: Spacing.xs,
  },
  title: {
    ...Typography.bodySm,
    color: Colors.dustGrey,
    fontWeight: '600',
    lineHeight: 20,
  },
  titleActive: {
    color: Colors.drySage,
  },
  meta: {
    flexDirection: 'row',
  },
  metaText: {
    ...Typography.caption,
  },
  description: {
    ...Typography.caption,
    color: Colors.lightGrey,
    lineHeight: 16,
  },
  actionIcon: {
    flexShrink: 0,
  },
})
