import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSubscriptionsStore } from '@/store/subscriptionsStore'
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assinaturas</Text>
        <Text style={styles.headerSubtitle}>Seus podcasts salvos</Text>
      </View>

      {subscriptions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔖</Text>
          <Text style={styles.emptyTitle}>Nenhuma assinatura ainda</Text>
          <Text style={styles.emptySubtitle}>
            Busque um podcast na aba “Buscar” e assine para ver ele aqui.
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
                <Image source={{ uri: item.imageUrl }} style={styles.artwork} />
              ) : (
                <View style={[styles.artwork, styles.artworkPlaceholder]}>
                  <Text style={styles.artworkEmoji}>🎙️</Text>
                </View>
              )}

              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.author} numberOfLines={1}>
                  {item.author}
                </Text>
                <View style={styles.actions}>
                  <Pressable onPress={() => handleOpen(item)} style={styles.openBtn}>
                    <Text style={styles.openText}>Abrir</Text>
                  </Pressable>
                  <Pressable onPress={() => unsubscribe(item.id)} style={styles.removeBtn}>
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
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2c2c2e',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#8e8e93',
    fontSize: 14,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 6,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#8e8e93',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2c2c2e',
  },
  artwork: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#2c2c2e',
    flexShrink: 0,
  },
  artworkPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkEmoji: {
    fontSize: 28,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  author: {
    color: '#8e8e93',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  openBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#1c1c1e',
    borderRadius: 8,
  },
  openText: {
    color: '#6C63FF',
    fontSize: 13,
    fontWeight: '700',
  },
  removeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#1c1c1e',
    borderRadius: 8,
  },
  removeText: {
    color: '#ff453a',
    fontSize: 13,
    fontWeight: '700',
  },
})
