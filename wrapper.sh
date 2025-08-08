#!/bin/bash

# Script wrapper para Convertidor de Imágenes
# Configura las variables de entorno necesarias para Sharp/libvips

# Obtener el directorio donde está instalada la aplicación
APP_DIR="$(dirname "$(readlink -f "$0")")"

# Configurar LD_LIBRARY_PATH para incluir las librerías de Sharp
export LD_LIBRARY_PATH="$APP_DIR/resources/app.asar.unpacked/node_modules/@img/sharp-linux-x64/lib:$APP_DIR/resources/app.asar.unpacked/node_modules/sharp/vendor/lib:$LD_LIBRARY_PATH"

# Ejecutar la aplicación
exec "$APP_DIR/convertidor_imagenes.bin" "$@"
