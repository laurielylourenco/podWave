import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { ScreenHeader } from '@/shared/components/ScreenHeader'
import { useSubscriptionsStore } from '@/store/subscriptionsStore'
import { Colors, Radius, Spacing, Typography } from '@/shared/theme'
import type { Podcast } from '@/shared/types/podcast'

export default function SubscriptionsScreen() {
  const router = useRouter()
  const subscriptions = useSubscriptionsStore((s) => s.subscriptions)
  const unsubscribe = useSubscriptionsStore((s) => s.unsubscribe)

  function handleOpen(podcast: Podcast) {
    router.push(
      `/podcast/${encodeURIComponent(podcast.id)}?feedUrl=${encodeURIComponent(
        podcast.feedUrl
      )}&title=${encodeURIComponent(podcast.title)}&imageUrl=${encodeURIComponent(
        podcast.imageUrl
      )}&author=${encodeURIComponent(podcast.author)}`
    )
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Assinaturas"
        subtitle={subscriptions.length > 0 ? `${subscriptions.length} podcasts salvos` : undefined}
      />

      {subscriptions.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="bookmark-outline" size={64} color={Colors.pine} />
          <Text style={styles.emptyTitle}>Nenhuma assinatura ainda</Text>
          <Text style={styles.emptySubtitle}>
            Busque um podcast na aba "Buscar" e assine para ver ele aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          data={subscriptions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.row}>
              {item.imageUrl ? (
                <Pressable onPress={() => handleOpen(item)}>
                  <Image source={{ uri: item.imageUrl }} style={styles.artwork} />
                </Pressable>
              ) : (
                <Pressable onPress={() => handleOpen(item)} style={[styles.artwork, styles.artworkPlaceholder]}>
                  <Ionicons name="mic-outline" size={28} color={Colors.medGrey} />
                </Pressable>
              )}

              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.author} numberOfLines={1}>
                  {item.author}
                </Text>
                <View style={styles.actions}>
                  <Pressable
                    onPress={() => handleOpen(item)}
                    style={({ pressed }) => [styles.openBtn, pressed && styles.btnPressed]}
                  >
                    <Text style={styles.openText}>Abrir</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => unsubscribe(item.id)}
                    style={({ pressed }) => [styles.removeBtn, pressed && styles.btnPressed]}
                  >
                    <Text style={styles.removeText}>Remover</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyTitle: {
    ...Typography.headline,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...Typography.bodySm,
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  artwork: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
    backgroundColor: Colors.cardBg,
    flexShrink: 0,
  },
  artworkPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  title: {
    ...Typography.bodySm,
    color: Colors.dustGrey,
    fontWeight: '600',
    lineHeight: 20,
  },
  author: {
    ...Typography.caption,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  openBtn: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.pine,
    borderRadius: Radius.sm,
  },
  openText: {
    ...Typography.label,
    color: Colors.drySage,
    fontWeight: '600',
  },
  removeBtn: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  removeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.error,
  },
  btnPressed: {
    opacity: 0.7,
  },
})
