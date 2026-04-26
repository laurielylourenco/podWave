import { Platform } from 'react-native'
import { createJSONStorage, type StateStorage } from 'zustand/middleware'

type MmkvLike = {
  set: (key: string, value: string) => void
  getString: (key: string) => string | undefined
  delete: (key: string) => void
}

function createStorageBackend(): MmkvLike {
  // `react-native-mmkv` não é suportado no Web.
  if (Platform.OS === 'web') {
    const mem = new Map<string, string>()
    return {
      set: (key, value) => mem.set(key, value),
      getString: (key) => mem.get(key),
      delete: (key) => mem.delete(key),
    }
  }

  // Import lazy para evitar quebra no bundle Web.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { MMKV } = require('react-native-mmkv') as { MMKV: new (config?: { id?: string }) => MmkvLike }
  return new MMKV({ id: 'podwave' })
}

const backend = createStorageBackend()

const storage: StateStorage = {
  setItem: (name, value) => {
    backend.set(name, value)
  },
  getItem: (name) => {
    const value = backend.getString(name)
    return value ?? null
  },
  removeItem: (name) => {
    backend.delete(name)
  },
}

export const mmkvZustandStorage = createJSONStorage(() => storage)
