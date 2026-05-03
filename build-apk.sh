#!/bin/bash

echo "🚀 Gerando APK do Podwave..."
echo ""
echo "Escolha uma opção:"
echo ""
echo "1) EAS Build (Recomendado - build na nuvem)"
echo "2) Build Local (requer Android SDK)"
echo ""
read -p "Digite 1 ou 2: " opcao

if [ "$opcao" == "1" ]; then
    echo ""
    echo "📱 Iniciando EAS Build..."
    echo ""
    
    # Verificar se está logado
    npx eas-cli whoami 2>/dev/null
    
    if [ $? -ne 0 ]; then
        echo "⚠️  Você precisa fazer login primeiro:"
        echo ""
        npx eas-cli login
    fi
    
    echo ""
    echo "🔨 Gerando APK..."
    echo ""
    npx eas-cli build --profile preview --platform android
    
    echo ""
    echo "✅ Build iniciado!"
    echo "📲 Quando terminar, você receberá um link para baixar o APK"
    
elif [ "$opcao" == "2" ]; then
    echo ""
    echo "🔧 Build Local..."
    echo ""
    
    # Limpar cache
    rm -rf node_modules/.cache
    rm -rf android
    
    # Prebuild
    npx expo prebuild --clean
    
    # Build
    cd android
    ./gradlew assembleRelease
    
    echo ""
    echo "✅ APK gerado!"
    echo "📲 Localização: android/app/build/outputs/apk/release/app-release.apk"
    
else
    echo "Opção inválida!"
fi
