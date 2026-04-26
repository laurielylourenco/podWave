process.env.EXPO_PUBLIC_PODCAST_INDEX_KEY = 'test-key'
process.env.EXPO_PUBLIC_PODCAST_INDEX_SECRET = 'test-secret'

const g = globalThis as unknown as {
  fetch?: typeof fetch
  TextEncoder?: typeof TextEncoder
  crypto?: Crypto
}

if (!g.TextEncoder) {
  g.TextEncoder = require('util').TextEncoder
}

if (!g.crypto || !g.crypto.subtle) {
  const { webcrypto } = require('crypto') as { webcrypto: Crypto }
  g.crypto = webcrypto
}

jest.mock('expo-crypto', () => {
  const { createHash } = require('crypto') as typeof import('crypto')
  return {
    CryptoDigestAlgorithm: { SHA1: 'SHA1' },
    digestStringAsync: async (_alg: string, data: string) =>
      createHash('sha1').update(data).digest('hex'),
  }
})
