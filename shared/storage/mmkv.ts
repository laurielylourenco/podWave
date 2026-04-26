import { MMKV } from 'react-native-mmkv'
import { createJSONStorage, type StateStorage } from 'zustand/middleware'

const mmkv = new MMKV({ id: 'podwave' })

const storage: StateStorage = {
  setItem: (name, value) => {
    mmkv.set(name, value)
  },
  getItem: (name) => {
    const value = mmkv.getString(name)
    return value ?? null
  },
  removeItem: (name) => {
    mmkv.delete(name)
  },
}

export const mmkvZustandStorage = createJSONStorage(() => storage)
