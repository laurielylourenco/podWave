import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useEpisodes } from '@/features/episodes/hooks/useEpisodes'
import { EpisodeItem } from '@/shared/components/EpisodeItem'
import { Colors, Radius, Spacing, Typography } from '@/shared/theme'
import { usePlayerStore } from '@/store/playerStore'
import { useSubscriptionsStore } from '@/store/subscriptionsStore'
import * as playerActions from '@/features/player/services/playerActions'
import type { Episode, Podcast } from '@/shared/types/podcast'

export default function PodcastScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { id, title, author, imageUrl, feedUrl } = useLocalSearchParams<{
    id: string
    title: string
    author: string
    imageUrl: string
    feedUrl?: string
  }>()

  const decodedTitle = decodeURIComponent(title ?? '')
  const decodedAuthor = decodeURIComponent(author ?? '')
  const decodedImageUrl = imageUrl ? decodeURIComponent(imageUrl) : ''
  const decodedFeedUrl = feedUrl ? decodeURIComponent(feedUrl) : undefined

  const { data: episodes, isLoading, isError, error, refetch } = useEpisodes({
    feedId: id,
    feedUrl: decodedFeedUrl,
  })

  const currentEpisodeId = usePlayerStore((s) => s.currentEpisode?.id)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const subscribe = useSubscriptionsStore((s) => s.subscribe)
  const unsubscribe = useSubscriptionsStore((s) => s.unsubscribe)
  const subscribed = useSubscriptionsStore((s) => s.subscriptions.some((p) => p.id === id))

  const podcast: Podcast = {
    id,
    title: decodedTitle,
    author: decodedAuthor,
    description: '',
    imageUrl: decodedImageUrl,
    feedUrl: decodedFeedUrl ?? '',
    categories: [],
    episodeCount: episodes?.length ?? 0,
  }

  function handleEpisodePress(episode: Episode) {
    void playerActions.playEpisode(episode)
  }

  function handleSubscribeToggle() {
    if (subscribed) {
      unsubscribe(id)
    } else {
      subscribe(podcast)
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.navbar, { paddingTop: insets.top + Spacing.xs }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.fern} />
          <Text style={styles.backLabel}>Voltar</Text>
        </Pressable>
      </View>

      <FlatList
        data={episodes ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EpisodeItem
            episode={item}
            onPress={handleEpisodePress}
            isPlaying={item.id === currentEpisodeId && isPlaying}
            isActive={item.id === currentEpisodeId}
          />
        )}
        ListHeaderComponent={
          <View>
            <View style={styles.hero}>
              {decodedImageUrl ? (
                <Image source={{ uri: decodedImageUrl }} style={styles.artwork} />
              ) : (
                <View style={[styles.artwork, styles.artworkPlaceholder]}>
                  <Ionicons name="mic-outline" size={48} color={Colors.medGrey} />
                </View>
              )}
              <View style={styles.heroInfo}>
                <Text style={styles.podcastTitle} numberOfLines={3}>
                  {decodedTitle}
                </Text>
                <Text style={styles.podcastAuthor} numberOfLines={1}>
                  {decodedAuthor}
                </Text>
                <Pressable
                  onPress={handleSubscribeToggle}
                  style={({ pressed }) => [
                    styles.subscribeBtn,
                    subscribed && styles.subscribeBtnActive,
                    pressed && styles.subscribeBtnPressed,
                  ]}
                >
                  <Ionicons
                    name={subscribed ? 'bookmark' : 'bookmark-outline'}
                    size={14}
                    color={subscribed ? Colors.white : Colors.drySage}
                  />
                  <Text style={[styles.subscribeText, subscribed && styles.subscribeTextActive]}>
                    {subscribed ? 'Assinado' : 'Assinar'}
                  </Text>
                </Pressable>
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
                <ActivityIndicator size="large" color={Colors.fern} />
                <Text style={styles.hint}>Carregando episódios...</Text>
              </View>
            )}

            {isError && (
              <View style={styles.centered}>
                <Ionicons name="warning-outline" size={48} color={Colors.medGrey} />
                <Text style={styles.errorText}>Falha ao carregar episódios.</Text>
                {!!error && (
                  <Text style={styles.errorDetails} numberOfLines={4}>
                    {error instanceof Error ? error.message : String(error)}
                  </Text>
                )}
                <Pressable
                  onPress={() => refetch()}
                  style={({ pressed }) => [styles.retryBtn, pressed && { opacity: 0.7 }]}
                >
                  <Text style={styles.retryText}>Tentar novamente</Text>
                </Pressable>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          !isLoading && !isError ? (
            <View style={styles.centered}>
              <Ionicons name="musical-notes-outline" size={48} color={Colors.medGrey} />
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
    backgroundColor: Colors.appBackground,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.appBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  backBtnPressed: {
    opacity: 0.6,
  },
  backLabel: {
    ...Typography.bodyLg,
    color: Colors.fern,
    fontWeight: '500',
  },
  hero: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.base,
    alignItems: 'flex-start',
  },
  artwork: {
    width: 110,
    height: 110,
    borderRadius: Radius.md,
    backgroundColor: Colors.cardBg,
  },
  artworkPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroInfo: {
    flex: 1,
    paddingTop: Spacing.xs,
    gap: Spacing.sm,
  },
  podcastTitle: {
    ...Typography.title,
    color: Colors.dustGrey,
    lineHeight: 26,
  },
  podcastAuthor: {
    ...Typography.bodySm,
    color: Colors.drySage,
  },
  subscribeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.fern,
    marginTop: Spacing.xs,
  },
  subscribeBtnActive: {
    backgroundColor: Colors.fern,
    borderColor: Colors.fern,
  },
  subscribeBtnPressed: {
    opacity: 0.7,
  },
  subscribeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.drySage,
  },
  subscribeTextActive: {
    color: Colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  sectionTitle: {
    ...Typography.title,
    color: Colors.dustGrey,
  },
  episodeCount: {
    ...Typography.caption,
  },
  listContent: {
    paddingBottom: Spacing.xxxl,
  },
  centered: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.md,
  },
  hint: {
    ...Typography.bodySm,
    marginTop: Spacing.sm,
  },
  emptyText: {
    ...Typography.bodySm,
    textAlign: 'center',
  },
  errorText: {
    ...Typography.bodySm,
    color: Colors.error,
    textAlign: 'center',
  },
  errorDetails: {
    ...Typography.caption,
    color: Colors.lightGrey,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + Spacing.xs,
    backgroundColor: Colors.pine,
    borderRadius: Radius.sm,
  },
  retryText: {
    ...Typography.label,
    color: Colors.drySage,
    fontWeight: '600',
  },
})
