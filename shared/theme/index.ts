// Design tokens — Podwave Visual Identity System v1.0

export const Colors = {
  // Backgrounds
  appBackground: '#0A0A0A',
  darkBg: '#111111',
  cardBg: '#1A1A1A',
  surfaceBg: '#1E1E1E',

  // Brand (Greens)
  dustGrey: '#DAD7CD',
  drySage: '#A3B18A',
  fern: '#588157',
  hunter: '#3A5A40',
  pine: '#344E41',

  // Text & Neutrals
  white: '#FFFFFF',
  lightGrey: '#B0B0B0',
  medGrey: '#666666',

  // Borders & Dividers
  divider: '#333333',
  dividerSubtle: '#2A2A2A',

  // Feedback
  error: '#ff453a',
} as const

export const Typography = {
  displayXl: { fontSize: 32, fontWeight: '700' as const, color: Colors.dustGrey },
  displayLg: { fontSize: 28, fontWeight: '700' as const, color: Colors.dustGrey },
  headline: { fontSize: 22, fontWeight: '600' as const, color: Colors.dustGrey },
  title: { fontSize: 18, fontWeight: '600' as const, color: Colors.drySage },
  bodyLg: { fontSize: 16, fontWeight: '400' as const, color: Colors.lightGrey },
  bodySm: { fontSize: 14, fontWeight: '400' as const, color: Colors.lightGrey },
  label: { fontSize: 12, fontWeight: '500' as const, color: Colors.fern },
  caption: { fontSize: 11, fontWeight: '400' as const, color: Colors.medGrey },
} as const

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  safe: 48,
  nav: 64,
} as const

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
} as const
