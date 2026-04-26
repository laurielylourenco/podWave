import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSleepTimer } from '@/features/player/hooks/useSleepTimer'
import { Colors, Radius, Spacing, Typography } from '@/shared/theme'

const PRESETS: { label: string; minutes: number }[] = [
  { label: '5 min', minutes: 5 },
  { label: '10 min', minutes: 10 },
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '60 min', minutes: 60 },
]

function formatTimeRemaining(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

interface Props {
  visible: boolean
  onClose: () => void
}

export function SleepTimerSheet({ visible, onClose }: Props) {
  const { timeRemaining, isActive, setTimer, clearTimer } = useSleepTimer()

  function handlePreset(minutes: number) {
    setTimer(minutes)
  }

  function handleClear() {
    clearTimer()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Ionicons name="moon-outline" size={20} color={Colors.drySage} />
          <Text style={styles.headerTitle}>Sleep Timer</Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={22} color={Colors.medGrey} />
          </Pressable>
        </View>

        {isActive && timeRemaining !== null && (
          <View style={styles.activeBox}>
            <Text style={styles.activeLabel}>Timer ativo</Text>
            <Text style={styles.activeTime}>{formatTimeRemaining(timeRemaining)}</Text>
            <Pressable
              onPress={handleClear}
              style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.7 }]}
            >
              <Text style={styles.cancelText}>Cancelar timer</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.sectionLabel}>Pausar em:</Text>

        <View style={styles.grid}>
          {PRESETS.map(({ label, minutes }) => (
            <Pressable
              key={minutes}
              onPress={() => handlePreset(minutes)}
              style={({ pressed }) => [styles.presetBtn, pressed && styles.presetBtnPressed]}
            >
              <Text style={styles.presetText}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
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
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
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
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    ...Typography.title,
    color: Colors.dustGrey,
    flex: 1,
  },
  activeBox: {
    backgroundColor: Colors.pine,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  activeLabel: {
    ...Typography.label,
    color: Colors.drySage,
  },
  activeTime: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.dustGrey,
    fontVariant: ['tabular-nums'],
  },
  cancelBtn: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.hunter,
    borderRadius: Radius.sm,
  },
  cancelText: {
    ...Typography.label,
    color: Colors.drySage,
    fontWeight: '600',
  },
  sectionLabel: {
    ...Typography.bodySm,
    color: Colors.medGrey,
    marginBottom: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  presetBtn: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.divider,
    minWidth: 80,
    alignItems: 'center',
  },
  presetBtnPressed: {
    backgroundColor: Colors.pine,
    borderColor: Colors.fern,
  },
  presetText: {
    ...Typography.bodySm,
    color: Colors.dustGrey,
    fontWeight: '600',
  },
})
