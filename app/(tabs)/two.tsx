import { StyleSheet, Text, View } from 'react-native'

export default function SubscriptionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔖</Text>
      <Text style={styles.title}>Assinaturas</Text>
      <Text style={styles.subtitle}>
        Seus podcasts favoritos aparecerão aqui.{'\n'}
        Em breve na Fase 4.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  icon: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#8e8e93',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
})
