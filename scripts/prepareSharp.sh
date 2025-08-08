#!/bin/bash

# Script para preparar Sharp para empaquetado multiplataforma
# Este script asegura que Sharp esté instalado con los binarios correctos

echo "🔧 Preparando Sharp para empaquetado..."

# Función para mostrar información del sistema
show_system_info() {
    echo "📋 Información del sistema:"
    echo "  OS: $(uname -s)"
    echo "  Arch: $(uname -m)"
    echo "  Node: $(node --version)"
    echo "  NPM: $(npm --version)"
}

# Función para limpiar Sharp
clean_sharp() {
    echo "🗑️  Limpiando instalación previa de Sharp..."
    rm -rf node_modules/sharp
    rm -rf node_modules/@img
}

# Función para instalar Sharp para una plataforma específica
install_sharp_for_platform() {
    local platform=$1
    local arch=$2
    
    echo "📦 Instalando Sharp para ${platform}-${arch}..."
    
    # Configurar variables de entorno para la plataforma objetivo
    export npm_config_platform=$platform
    export npm_config_arch=$arch
    export npm_config_target_platform=$platform
    export npm_config_target_arch=$arch
    export npm_config_build_from_source=false
    
    # Instalar Sharp específico para la plataforma
    npm install sharp --platform=${platform} --arch=${arch} --force --verbose
    
    # También instalar los binarios específicos de la plataforma
    case $platform in
        "win32")
            echo "📦 Instalando binarios específicos para Windows..."
            npm install @img/sharp-win32-x64 --force || echo "⚠️  Binario win32-x64 no disponible"
            npm install @img/sharp-libvips-win32-x64 --force || echo "⚠️  Libvips win32-x64 no disponible"
            ;;
        "darwin")
            echo "📦 Instalando binarios específicos para macOS..."
            npm install @img/sharp-darwin-x64 --force || echo "⚠️  Binario darwin-x64 no disponible"
            npm install @img/sharp-libvips-darwin-x64 --force || echo "⚠️  Libvips darwin-x64 no disponible"
            ;;
        "linux")
            echo "📦 Binarios de Linux ya instalados"
            ;;
    esac
    
    # Verificar instalación
    if [ -d "node_modules/sharp" ]; then
        echo "✅ Sharp instalado correctamente"
        
        # Mostrar información de la instalación
        echo "📋 Información de Sharp instalado:"
        ls -la node_modules/sharp/
        
        # Mostrar binarios específicos instalados
        echo "🔍 Binarios específicos para ${platform}:"
        ls -la node_modules/@img/ | grep -i $platform || echo "  No se encontraron binarios específicos"
        
        # Buscar binarios nativos
        echo "🔍 Binarios nativos encontrados:"
        find node_modules/sharp -name "*.node" -o -name "*.dll" -o -name "*.so" -o -name "*.dylib" 2>/dev/null || echo "  No se encontraron binarios nativos visibles"
        
        return 0
    else
        echo "❌ Error: Sharp no se instaló correctamente"
        return 1
    fi
}

# Función para probar Sharp
test_sharp() {
    echo "🧪 Probando Sharp..."
    node scripts/testSharp.js
    return $?
}

# Main script
main() {
    show_system_info
    
    # Obtener plataforma objetivo desde argumentos o detectar automáticamente
    TARGET_PLATFORM=${1:-win32}
    TARGET_ARCH=${2:-x64}
    
    echo "🎯 Plataforma objetivo: ${TARGET_PLATFORM}-${TARGET_ARCH}"
    
    # Limpiar instalación previa
    clean_sharp
    
    # Instalar Sharp para la plataforma objetivo
    if install_sharp_for_platform $TARGET_PLATFORM $TARGET_ARCH; then
        echo "✅ Preparación completada"
        
        # Probar Sharp
        if test_sharp; then
            echo "🎉 Sharp funciona correctamente"
            exit 0
        else
            echo "⚠️  Sharp instalado pero no funciona completamente"
            exit 1
        fi
    else
        echo "❌ Error preparando Sharp"
        exit 1
    fi
}

# Ejecutar script principal
main "$@"
