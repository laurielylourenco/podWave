# 🎙️ Podwave

> App de podcasts moderno, offline-first, construído com React Native + Expo.

---

## ✨ Visão Geral

O **Podwave** é um player de podcasts completo para iOS e Android. Ele permite buscar, assinar, ouvir e baixar podcasts diretamente das fontes RSS dos criadores — sem servidor próprio, sem intermediários.

---

## 📱 Funcionalidades

| Feature | Status |
|---|---|
| Busca de podcasts via Podcast Index API | ✅ Concluído |
| iTunes Search API como fallback automático | ✅ Concluído |
| Cache e loading states com TanStack Query | ✅ Concluído |
| Tela de detalhes com lista de episódios | ✅ Concluído |
| Assinaturas com feed unificado de episódios | 🔲 Fase 4 |
| Player: play/pause, seek ±15s, velocidade | 🔲 Fase 3 |
| Sleep timer | 🔲 Fase 3 |
| Fila drag-and-drop | 🔲 Fase 3 |
| Controles na lock screen e notificação | 🔲 Fase 3 |
| Mini-player persistente | 🔲 Fase 4 |
| Player expandido (modal) | 🔲 Fase 4 |
| Download offline de episódios | 🔲 Fase 5 |
| Histórico e retomada de posição | 🔲 Fase 5 |
| Bookmarks | 🔲 Fase 5 |

---

## 🗂️ Arquitetura

O projeto segue **Feature-Sliced Design**:

```
Podwave/
├── app/                    # Rotas (Expo Router)
│   ├── (tabs)/             # Navegação por abas
│   │   ├── index.tsx       # Tela de Busca
│   │   └── two.tsx         # Tela de Assinaturas
│   ├── podcast/[id].tsx    # Detalhe do Podcast + Episódios
│   └── _layout.tsx         # Layout raiz (QueryClientProvider)
├── features/               # Domínios de negócio
│   ├── podcasts/
│   │   ├── api/            # podcastIndex.ts · itunes.ts
│   │   └── hooks/          # useSearchPodcasts.ts
│   ├── episodes/
│   │   └── hooks/          # useEpisodes.ts
│   ├── player/             # (Fase 3)
│   └── downloads/          # (Fase 5)
├── shared/                 # Reutilizáveis
│   ├── components/         # PodcastCard · EpisodeItem
│   ├── hooks/              # useDebounce
│   └── types/              # podcast.ts
└── store/                  # Zustand (playerStore · subscriptionsStore)
```

---

## 🔌 Como os dados chegam ao app

O Podwave não hospeda nenhum áudio. Ele lê diretamente o RSS de cada podcast:

```
Busca por nome
      ↓
Podcast Index API  →  retorna lista de podcasts
      ↓  (fallback automático para iTunes se a API falhar)
Usuário seleciona um podcast
      ↓
getEpisodes(feedId) via Podcast Index API
      ↓
Lista de episódios + URLs dos MP3s
      ↓
react-native-track-player toca o áudio  ← Fase 3
```

**Fontes de dados:**
- **[Podcast Index API](https://podcastindex.org/)** — diretório principal (gratuito, open source)
- **[iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/)** — fallback automático da Apple

---

## 🛠️ Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | React Native + Expo SDK 54 |
| Navegação | Expo Router |
| Estado global | Zustand |
| Cache remoto | TanStack Query v5 |
| Persistência leve | MMKV |
| Banco offline | WatermelonDB |
| Player de áudio | react-native-track-player |
| UI | NativeWind + StyleSheet |
| Animações | Reanimated 3 |
| CI/CD | EAS Build + Submit |
| Monitoramento | Sentry |
| Testes | Jest + Testing Library |

---

## 🗺️ Roadmap

### Fase 1 — Fundação ✅
- [x] Inicializar projeto (Expo SDK 54, TypeScript estrito)
- [x] Configurar Expo Router
- [x] Instalar dependências core
- [x] Criar estrutura Feature-Sliced Design

### Fase 2 — Integração com APIs ✅
- [x] Podcast Index API (busca e feed de episódios)
- [x] iTunes Search API (fallback automático)
- [x] TanStack Query (cache, loading states, debounce)
- [x] Tela de Busca com grid de resultados
- [x] Tela de Detalhe com lista de episódios

### Fase 3 — Player de Áudio
- [ ] react-native-track-player em background
- [ ] Play/pause, seek ±15s, velocidade (0.5×–2×)
- [ ] Sleep timer e fila drag-and-drop
- [ ] Controles nativos (lock screen / notificação)

### Fase 4 — UI/UX
- [ ] Mini-player persistente
- [ ] Player expandido (modal)
- [ ] Tela de feed de assinaturas
- [ ] Animações com Reanimated 3

### Fase 5 — Offline & Persistência
- [ ] Download de episódios
- [ ] WatermelonDB para dados offline
- [ ] Retomada automática de posição
- [ ] Background fetch de feeds RSS

### Fase 6 — Qualidade
- [ ] Testes (Jest + Testing Library)
- [ ] Sentry para monitoramento de erros
- [ ] EAS Build/Submit para CI/CD

---

## 🚀 Como rodar

```bash
# Clonar e instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env
# Preencha EXPO_PUBLIC_PODCAST_INDEX_KEY e EXPO_PUBLIC_PODCAST_INDEX_SECRET
# Obtenha as chaves em https://api.podcastindex.org/
# Obs.: sem as chaves, o app usa iTunes como fallback automaticamente

# Rodar na web
npx expo start --web --offline

# Rodar no iOS
npx expo run:ios

# Rodar no Android
npx expo run:android
```

---

## 📄 Licença

MIT © Podwave
