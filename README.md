# Convertidor de Imágenes

Conversor multiplataforma profesional desarrollado con Electron, React, Zustand y Sharp. Permite convertir imágenes entre formatos populares, manteniendo la estructura de carpetas, con previews y estado en tiempo real. Robusto y portable para Linux, Windows y Mac.

## 🚀 Características principales

- **Formatos soportados:** JPEG, PNG, WebP, AVIF, TIFF
- **Escaneo recursivo:** Mantiene subcarpetas
- **Conversión por lotes:** Procesa muchas imágenes a la vez
- **Calidad ajustable:** Compresión 1-100%
- **Vista previa:** Previsualización antes de convertir
- **Auto-actualizaciones:** Integrado (GitHub Releases)
- **Multiplataforma:** Linux, Windows, macOS
- **Interfaz moderna:** UI intuitiva y responsive

## 📁 Modos de selección

- **Archivo individual:** Permite seleccionar una sola imagen
- **Archivos múltiples:** Permite seleccionar varias imágenes.
- **Carpeta completa:** Convierte todas las imágenes de una carpeta y subcarpetas, manteniendo la estructura

## 🛠️ Instalación y desarrollo

### Prerrequisitos

- Node.js 18+
- pnpm y npm

### Instalación

```bash
git clone https://github.com/jesusrosales17/image-converter.git
cd convertidor_imagenes
npm install
cd src/renderer
npm install # o npm install
cd ../..
```

### Desarrollo

Ejecuta primero el renderer (React) y luego el main process:

```bash
npm run dev # Hot reload
```

### Build y distribución

```bash
# Linux (AppImage, DEB, RPM, TAR.GZ)
npm run electron:build:linux
# Windows (NSIS installer, portable)
npm run electron:build:win
# macOS (DMG, ZIP)
npm run electron:build:mac
# Todas las plataformas
npm run electron:build
```

## 📦 Estructura del proyecto

```
convertidor_imagenes/
├── src/
│   ├── main/           # Main process (Electron)
│   ├── preload/        # Preload scripts
│   ├── renderer/       # Renderer (React)
│   └── types/          # Tipos compartidos
├── assets/             # Iconos
├── dist/               # Archivos compilados
└── release/            # Binarios generados
```

## 🔧 Configuración de auto-actualizaciones

La app verifica actualizaciones desde GitHub Releases. Para usar tu propio repo:

1. Edita `package.json`:

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "tu-usuario",
      "repo": "tu-repositorio"
    }
  }
}
```

2. Configura tu token:

```bash
export GH_TOKEN="tu-github-token"
pnpm run publish
```


## 📥 Descargas

### Windows

- [Instalador (EXE)](https://github.com/jesusrosales17/image-converter/releases/latest/download/Image%20Converter-1.0.0-win-x64.exe)
- [Portable (ZIP)](https://github.com/jesusrosales17/image-converter/releases/latest/download/Image%20Converter-1.0.0-win.zip)

### Linux

- [AppImage](https://github.com/jesusrosales17/image-converter/releases/latest/download/Image%20Converter-1.0.0-linux-x86_64.AppImage)
- [Tar.gz](https://github.com/jesusrosales17/image-converter/releases/latest/download/Image%20Converter-1.0.0-linux-x64.tar.gz)

## 🎯 Uso

1. Selecciona imágenes (individual, múltiple o carpeta)
2. Configura conversión: formato, calidad, carpeta destino
3. Inicia conversión y revisa el progreso en tiempo real
4. Las imágenes convertidas mantienen la estructura original

## 💡 Tips

- **WebP:** Mejor compresión para web
- **AVIF:** Máxima compresión, soporte moderno
- **PNG:** Sin pérdida, ideal para logos
- **Calidad 80-90:** Buen balance
- Los archivos existentes se omiten automáticamente

## 🔄 Limpieza automática

La lista se limpia al cambiar de modo:

- Carpeta → Individual/Múltiple: elimina imágenes de carpeta
- Individual/Múltiple → Carpeta: elimina archivos individuales

## 📝 Licencia

MIT License - ver [LICENSE](LICENSE)

## 🤝 Contribuir

1. Haz fork
2. Crea una rama (`git checkout -b feature/LoQueSea`)
3. Commit (`git commit -m 'LoQueSea'`)
4. Push (`git push origin feature/LoQueSea`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o sugerencias:

- Abre un [issue](https://github.com/jesusrosales17/image-converter/issues)
- Revisa la [wiki](https://github.com/jesusrosales17/image-converter.git/wiki)

---

Desarrollado usando Electron + React + Zustand + Sharp
