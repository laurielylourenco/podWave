const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

// Workaround: evita resolver entradas ESM com `import.meta` via `package.json#exports`.
config.resolver.unstable_enablePackageExports = false

// Stub react-native-track-player na plataforma web (não suporta sem shaka-player)
const originalResolveRequest = config.resolver.resolveRequest

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === 'web' &&
    (moduleName === 'react-native-track-player' ||
      moduleName.startsWith('react-native-track-player/'))
  ) {
    return {
      filePath: path.resolve(__dirname, 'mocks/react-native-track-player.web.js'),
      type: 'sourceFile',
    }
  }

  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform)
  }

  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
