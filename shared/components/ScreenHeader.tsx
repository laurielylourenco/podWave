import { type ReactNode } from 'react'
import { StyleSheet, Text, View, type ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors, Spacing, Typography } from '@/shared/theme'

interface Props {
  title: string
  subtitle?: string
  rightSlot?: ReactNode
  style?: ViewStyle
}

export function ScreenHeader({ title, subtitle, rightSlot, style }: Props) {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }, style]}>
      <View style={styles.row}>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.base,
    backgroundColor: Colors.appBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  textBlock: {
    flex: 1,
    gap: Spacing.xs,
  },
  title: {
    ...Typography.headline,
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.medGrey,
  },
  rightSlot: {
    marginLeft: Spacing.base,
  },
})
