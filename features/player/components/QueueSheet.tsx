import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import DraggableFlatList, {
  type RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useQueue } from '@/features/player/hooks/useQueue'
import { Colors, Radius, Spacing, Typography } from '@/shared/theme'
import type { Episode } from '@/shared/types/podcast'

interface Props {
  visible: boolean
  onClose: () => void
}

function formatDuration(seconds: number): string {
  if (!seconds) return ''
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}min`
  return `${m}min`
}

export function QueueSheet({ visible, onClose }: Props) {
  const { queue, currentEpisode, removeFromQueue, reorderQueue } = useQueue()

  function renderItem({ item, drag, isActive }: RenderItemParams<Episode>) {
    const isCurrent = item.id === currentEpisode?.id

    return (
      <ScaleDecorator activeScale={0.97}>
        <Pressable
          onLongPress={drag}
          disabled={isActive}
          style={[styles.item, isCurrent && styles.itemActive, isActive && styles.itemDragging]}
        >
          <Ionicons
            name="reorder-three-outline"
            size={22}
            color={Colors.medGrey}
            style={styles.dragHandle}
          />

          <View style={styles.itemContent}>
            <Text style={[styles.itemTitle, isCurrent && styles.itemTitleActive]} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.itemMeta}>
              {item.podcastTitle}
              {item.duration > 0 ? ` · ${formatDuration(item.duration)}` : ''}
            </Text>
          </View>

          {isCurrent && (
            <Ionicons name="volume-high" size={18} color={Colors.fern} />
          )}

          <Pressable
            onPress={() => void removeFromQueue(item.id)}
            hitSlop={8}
            style={styles.removeBtn}
          >
            <Ionicons name="close-circle-outline" size={22} color={Colors.medGrey} />
          </Pressable>
        </Pressable>
      </ScaleDecorator>
    )
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <GestureHandlerRootView style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Ionicons name="list-outline" size={20} color={Colors.drySage} />
          <Text style={styles.headerTitle}>Fila de reprodução</Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={22} color={Colors.medGrey} />
          </Pressable>
        </View>

        {queue.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="musical-notes-outline" size={48} color={Colors.medGrey} />
            <Text style={styles.emptyText}>Fila vazia</Text>
            <Text style={styles.emptySubtext}>
              Toque em um episódio para começar a ouvir
            </Text>
          </View>
        ) : (
          <DraggableFlatList
            data={queue}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            onDragEnd={({ from, to }) => void reorderQueue(from, to)}
            contentContainerStyle={styles.listContent}
          />
        )}
      </GestureHandlerRootView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: Colors.darkBg,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '75%',
    paddingTop: Spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.divider,
    alignSelf: 'center',
    marginBottom: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  headerTitle: {
    ...Typography.title,
    color: Colors.dustGrey,
    flex: 1,
  },
  listContent: {
    paddingBottom: Spacing.xxxl,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: Spacing.sm,
  },
  itemActive: {
    backgroundColor: Colors.cardBg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.fern,
  },
  itemDragging: {
    backgroundColor: Colors.pine,
  },
  dragHandle: {
    flexShrink: 0,
  },
  itemContent: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    ...Typography.bodySm,
    color: Colors.dustGrey,
    fontWeight: '600',
  },
  itemTitleActive: {
    color: Colors.drySage,
  },
  itemMeta: {
    ...Typography.caption,
  },
  removeBtn: {
    flexShrink: 0,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyText: {
    ...Typography.headline,
    textAlign: 'center',
  },
  emptySubtext: {
    ...Typography.bodySm,
    textAlign: 'center',
  },
})
