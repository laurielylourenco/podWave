import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useSearchPodcasts } from '@/features/podcasts/hooks/useSearchPodcasts'
import { PodcastCard } from '@/shared/components/PodcastCard'
import { ScreenHeader } from '@/shared/components/ScreenHeader'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { Colors, Radius, Spacing, Typography } from '@/shared/theme'
import type { Podcast } from '@/shared/types/podcast'

export default function SearchScreen() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)

  const { data: podcasts, isLoading, isError } = useSearchPodcasts(debouncedQuery)

  function handlePodcastPress(podcast: Podcast) {
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
      <ScreenHeader title="Podwave" subtitle="Descubra seus próximos podcasts favoritos" />

      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={Colors.medGrey} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar podcasts..."
            placeholderTextColor={Colors.medGrey}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {isLoading && debouncedQuery.length > 2 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.fern} />
          <Text style={styles.hint}>Buscando podcasts...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Ionicons name="warning-outline" size={48} color={Colors.medGrey} />
          <Text style={styles.errorText}>Falha na busca. Verifique sua conexão.</Text>
        </View>
      ) : podcasts && podcasts.length > 0 ? (
        <FlatList
          data={podcasts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <View style={styles.col}>
              <PodcastCard podcast={item} onPress={handlePodcastPress} />
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : debouncedQuery.length > 2 ? (
        <View style={styles.centered}>
          <Ionicons name="mic-outline" size={48} color={Colors.medGrey} />
          <Text style={styles.emptyText}>Nenhum podcast encontrado para "{debouncedQuery}"</Text>
        </View>
      ) : (
        <View style={styles.centered}>
          <Ionicons name="headset-outline" size={64} color={Colors.pine} />
          <Text style={styles.welcomeTitle}>Descubra podcasts</Text>
          <Text style={styles.welcomeSubtitle}>Digite ao menos 3 letras para buscar</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground,
  },
  searchWrapper: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    backgroundColor: Colors.appBackground,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceBg,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.base,
    height: 52,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodyLg,
    color: Colors.dustGrey,
    height: '100%',
  },
  grid: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  col: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.md,
  },
  hint: {
    ...Typography.bodySm,
    marginTop: Spacing.sm,
  },
  welcomeTitle: {
    ...Typography.headline,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    ...Typography.bodySm,
    textAlign: 'center',
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
})
