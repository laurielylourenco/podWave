import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { useEpisodes } from '@/features/episodes/hooks/useEpisodes'
import { EpisodeItem } from '@/shared/components/EpisodeItem'
import type { Episode } from '@/shared/types/podcast'

export default function PodcastScreen() {
  const router = useRouter()
  const { id, title, author, imageUrl, feedUrl } = useLocalSearchParams<{
    id: string
    title: string
    author: string
    imageUrl: string
    feedUrl?: string
  }>()

  const [descExpanded, setDescExpanded] = useState(false)

  const decodedFeedUrl = feedUrl ? decodeURIComponent(feedUrl) : undefined
  const { data: episodes, isLoading, isError, refetch } = useEpisodes({
    feedId: id,
    feedUrl: decodedFeedUrl,
  })

  function handleEpisodePress(_episode: Episode) {
    // Fase 3: integrar com player
  }

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backLabel}>Voltar</Text>
        </Pressable>
      </View>

      <FlatList
        data={episodes ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EpisodeItem episode={item} onPress={handleEpisodePress} />
        )}
        ListHeaderComponent={
          <View>
            <View style={styles.hero}>
              {imageUrl ? (
                <Image
                  source={{ uri: decodeURIComponent(imageUrl) }}
                  style={styles.artwork}
                />
              ) : (
                <View style={[styles.artwork, styles.artworkPlaceholder]}>
                  <Text style={styles.artworkEmoji}>🎙️</Text>
                </View>
              )}
              <View style={styles.heroInfo}>
                <Text style={styles.podcastTitle} numberOfLines={3}>
                  {decodeURIComponent(title ?? '')}
                </Text>
                <Text style={styles.podcastAuthor} numberOfLines={1}>
                  {decodeURIComponent(author ?? '')}
                </Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Episódios</Text>
              {episodes && episodes.length > 0 && (
                <Text style={styles.episodeCount}>{episodes.length} episódios</Text>
              )}
            </View>

            {isLoading && (
              <View style={styles.centered}>
                <ActivityIndicator size="large" color="#6C63FF" />
                <Text style={styles.hint}>Carregando episódios...</Text>
              </View>
            )}

            {isError && (
              <View style={styles.centered}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>Falha ao carregar episódios.</Text>
                <Pressable onPress={() => refetch()} style={styles.retryBtn}>
                  <Text style={styles.retryText}>Tentar novamente</Text>
                </Pressable>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          !isLoading && !isError ? (
            <View style={styles.centered}>
              <Text style={styles.emptyIcon}>🎵</Text>
              <Text style={styles.emptyText}>Nenhum episódio encontrado</Text>
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2c2c2e',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  backIcon: {
    color: '#6C63FF',
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 32,
  },
  backLabel: {
    color: '#6C63FF',
    fontSize: 17,
  },
  hero: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
    alignItems: 'flex-start',
  },
  artwork: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#2c2c2e',
  },
  artworkPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkEmoji: {
    fontSize: 48,
  },
  heroInfo: {
    flex: 1,
    paddingTop: 4,
    gap: 6,
  },
  podcastTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  podcastAuthor: {
    color: '#8e8e93',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2c2c2e',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  episodeCount: {
    color: '#636366',
    fontSize: 13,
  },
  listContent: {
    paddingBottom: 40,
  },
  centered: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
    gap: 12,
  },
  hint: {
    color: '#8e8e93',
    fontSize: 15,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    color: '#8e8e93',
    fontSize: 15,
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: 48,
  },
  errorText: {
    color: '#ff453a',
    fontSize: 15,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1c1c1e',
    borderRadius: 8,
  },
  retryText: {
    color: '#6C63FF',
    fontSize: 15,
    fontWeight: '600',
  },
})
