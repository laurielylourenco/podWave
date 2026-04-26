import React from 'react'
import { Tabs } from 'expo-router'
import { Colors, Spacing } from '@/shared/theme'
import { useClientOnlyValue } from '@/components/useClientOnlyValue'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

function TabIcon({ name, color }: { name: IoniconsName; color: string }) {
  return <Ionicons name={name} size={22} color={color} />
}

export default function TabLayout() {
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.fern,
        tabBarInactiveTintColor: Colors.medGrey,
        tabBarStyle: {
          backgroundColor: Colors.surfaceBg,
          borderTopColor: Colors.divider,
          borderTopWidth: 1,
          // Base + safe area (home indicator/gestos)
          height: 64 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, Spacing.sm),
          paddingTop: Spacing.sm,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerShown: useClientOnlyValue(false, false),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color }) => <TabIcon name="search-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Assinaturas',
          tabBarIcon: ({ color }) => <TabIcon name="bookmark-outline" color={color} />,
        }}
      />
    </Tabs>
  )
}
