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

  // Em Expo Go, o módulo nativo do MMKV pode não existir.
  // Tentamos MMKV e, se falhar, fazemos fallback para AsyncStorage.
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MMKV } = require('react-native-mmkv') as {
      MMKV: new (config?: { id?: string }) => MmkvLike
    }
    return new MMKV({ id: 'podwave' })
  } catch {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AsyncStorage = require('@react-native-async-storage/async-storage')
      .default as {
      setItem: (key: string, value: string) => Promise<void>
      getItem: (key: string) => Promise<string | null>
      removeItem: (key: string) => Promise<void>
    }

    const mem = new Map<string, string>()
    return {
      set: (key, value) => {
        mem.set(key, value)
        void AsyncStorage.setItem(key, value)
      },
      getString: (key) => {
        return mem.get(key)
      },
      delete: (key) => {
        mem.delete(key)
        void AsyncStorage.removeItem(key)
      },
    }
  }
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
