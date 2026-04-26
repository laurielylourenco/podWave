type Store = Map<string, string>

const stores = new Map<string, Store>()

function getStore(id: string): Store {
  const existing = stores.get(id)
  if (existing) return existing
  const created = new Map<string, string>()
  stores.set(id, created)
  return created
}

export class MMKV {
  private store: Store

  constructor(config?: { id?: string }) {
    this.store = getStore(config?.id ?? 'default')
  }

  set(key: string, value: string) {
    this.store.set(key, value)
  }

  getString(key: string) {
    return this.store.get(key)
  }

  delete(key: string) {
    this.store.delete(key)
  }
}

