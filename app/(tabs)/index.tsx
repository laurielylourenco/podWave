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
import { useSearchPodcasts } from '@/features/podcasts/hooks/useSearchPodcasts'
import { PodcastCard } from '@/shared/components/PodcastCard'
import { useDebounce } from '@/shared/hooks/useDebounce'
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Podwave</Text>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar podcasts..."
            placeholderTextColor="#636366"
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
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.hint}>Buscando podcasts...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.errorIcon}>⚠️</Text>
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
          <Text style={styles.emptyIcon}>🎙️</Text>
          <Text style={styles.emptyText}>Nenhum podcast encontrado para "{debouncedQuery}"</Text>
        </View>
      ) : (
        <View style={styles.centered}>
          <Text style={styles.welcomeIcon}>🎧</Text>
          <Text style={styles.welcomeTitle}>Descubra podcasts</Text>
          <Text style={styles.welcomeSubtitle}>
            Digite ao menos 3 letras para buscar
          </Text>
        </View>
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
    backgroundColor: '#000',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2c2c2e',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    height: '100%',
  },
  grid: {
    paddingHorizontal: 6,
    paddingTop: 12,
    paddingBottom: 40,
  },
  col: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  hint: {
    color: '#8e8e93',
    fontSize: 15,
    marginTop: 8,
  },
  welcomeIcon: {
    fontSize: 64,
    marginBottom: 8,
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  welcomeSubtitle: {
    color: '#8e8e93',
    fontSize: 15,
    textAlign: 'center',
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
})
