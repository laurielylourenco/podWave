const { getDefaultConfig } = require('expo/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

// Workaround: evita resolver entradas ESM com `import.meta` via `package.json#exports`.
config.resolver.unstable_enablePackageExports = false

module.exports = config

