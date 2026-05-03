# Como Gerar o APK do Podwave

## ✅ Mudanças Já Implementadas

Todas as correções para o crash do APK já foram aplicadas:
- ✅ Entry point customizado (`index.js`)
- ✅ Playback Service refatorado
- ✅ New Architecture desabilitada
- ✅ Permissões Android configuradas

## 📱 Opção 1: EAS Build (Recomendado)

### Passo 1: Instalar EAS CLI globalmente (se não tiver)
```bash
npm install -g eas-cli
```

### Passo 2: Fazer login na sua conta Expo
```bash
eas login
```

### Passo 3: Gerar o APK
```bash
cd /home/lauri/PROJETOS/Podwave
eas build --profile preview --platform android
```

### Passo 4: Aguardar o build
- O EAS vai fazer o build na nuvem (5-15 minutos)
- Quando terminar, você receberá um link para baixar o APK
- Baixe e instale no seu celular

---

## 🔧 Opção 2: Build Local (requer Android SDK)

### Pré-requisitos
- Android SDK instalado
- Variáveis de ambiente configuradas (ANDROID_HOME, etc.)

### Comandos
```bash
cd /home/lauri/PROJETOS/Podwave

# Limpar cache
rm -rf node_modules/.cache
rm -rf android

# Gerar o APK
npx expo prebuild --clean
cd android
./gradlew assembleRelease

# O APK estará em:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎯 Opção 3: EAS Build via Web (Sem linha de comando)

1. Acesse: https://expo.dev/
2. Faça login na sua conta
3. Vá em "Projects" → Selecione "podwave"
4. Clique em "Build" no menu lateral
5. Configure:
   - Platform: Android
   - Build profile: preview
6. Clique em "Build"
7. Aguarde e baixe o APK quando estiver pronto

---

## ⚡ Método Rápido (se você já tem EAS configurado)

```bash
# Um comando só:
eas build -p android --profile preview
```

---

## 🐛 Se o Build Falhar

### Erro de login:
```bash
eas logout
eas login
```

### Erro de configuração:
```bash
eas build:configure
```

### Erro de rede:
- Verifique sua conexão
- Tente novamente em alguns minutos

---

## 📲 Instalar o APK no Celular

1. Baixe o APK no seu celular (via link do EAS)
2. Abra o arquivo APK
3. Permita instalação de fontes desconhecidas (se solicitado)
4. Instale o app
5. Abra e teste!

---

## ✅ O Que Esperar

Após instalar o APK com as correções:
- ✅ O app deve abrir sem crashar
- ✅ A tela de busca deve aparecer normalmente
- ✅ O TrackPlayer está pronto para tocar áudio
- ✅ Audio funcionará em background

Se o app ainda crashar, me avise e vamos investigar com logs!
