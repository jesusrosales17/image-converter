# Convertidor de Imágenes

Un conversor de imágenes profesional desarrollado con Electron, React, TypeScript y Sharp. Permite convertir imágenes entre diferentes formatos con calidad profesional y soporte para múltiples modos de selección.

## 🚀 Características

- **Múltiples formatos soportados**: JPEG, PNG, WebP, AVIF, TIFF
- **Escaneo recursivo de carpetas**: Mantiene la estructura de subcarpetas
- **Conversión por lotes**: Procesa múltiples imágenes simultáneamente
- **Calidad ajustable**: Control de compresión de 1-100%
- **Vista previa en tiempo real**: Previsualización de imágenes antes de convertir
- **Auto-actualizaciones**: Sistema automático de actualizaciones
- **Multiplataforma**: Compatible con Linux, Windows y macOS
- **Interfaz moderna**: UI intuitiva y responsive

## 📁 Modos de Selección

### 1. Archivo Individual

Selecciona una sola imagen para convertir.

### 2. Archivos Múltiples

Selecciona varias imágenes individualmente desde diferentes ubicaciones.

### 3. Carpeta Completa

Selecciona una carpeta y convierte automáticamente todas las imágenes encontradas en ella y sus subcarpetas, manteniendo la estructura original.

## 🛠️ Desarrollo

### Prerrequisitos

- Node.js 18+
- pnpm y npm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/convertidor_imagenes.git
cd convertidor_imagenes

# Instalar dependencias del main process
npm install

# Instalar dependencias del renderer process
cd src/renderer
pnpm install o npm install
cd ../..
```

### Scripts de Desarrollo

```bash
# Modo desarrollo
pnpm run dev

# Compilar TypeScript
pnpm run build

# Compilar renderer
pnpm run build:renderer

# Compilar todo
pnpm run build:all
```

### Construcción de Binarios

#### Linux

```bash
# AppImage, DEB, RPM y TAR.GZ
pnpm run electron:build:linux
```

#### Windows

```bash
# NSIS installer y portable
pnpm run electron:build:win
```

#### macOS

```bash
# DMG y ZIP
pnpm run electron:build:mac
```

#### Todas las plataformas

```bash
pnpm run electron:build
```

## 📦 Estructura del Proyecto

```
convertidor_imagenes/
├── src/
│   ├── main/           # Main process (Electron)
│   ├── preload/        # Preload scripts
│   ├── renderer/       # Renderer process (React)
│   └── types/          # Tipos compartidos
├── assets/             # Iconos de la aplicación
├── dist/               # Archivos compilados
└── release/            # Binarios generados
```

## 🔧 Configuración

### Auto-actualizaciones

La aplicación está configurada para verificar automáticamente actualizaciones desde GitHub Releases. Para configurar tu propio repositorio:

1. Actualiza el `package.json`:

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

2. Configura un GitHub token para publicar:

```bash
export GH_TOKEN="tu-github-token"
pnpm run publish
```

## 🎯 Uso de la Aplicación

1. **Seleccionar imágenes**: Elige archivos individuales, múltiples o una carpeta completa
2. **Configurar conversión**:
   - Formato de salida (JPEG, PNG, WebP, AVIF, TIFF)
   - Calidad de compresión (1-100%)
   - Carpeta de destino
3. **Iniciar conversión**: El progreso se muestra en tiempo real
4. **Revisar resultados**: Las imágenes convertidas mantienen la estructura original

## 💡 Tips y Recomendaciones

- **WebP**: Mejor compresión, ideal para web
- **AVIF**: Máxima compresión, soporte moderno
- **PNG**: Sin pérdida, ideal para logos y gráficos
- **Calidad 80-90**: Buen balance entre tamaño y calidad
- Los archivos existentes se omiten automáticamente

## 🔄 Comportamiento de Limpieza

La aplicación limpia automáticamente la lista cuando cambias entre modos de selección:

- **Carpeta → Individual/Múltiple**: Se eliminan todas las imágenes de la carpeta
- **Individual/Múltiple → Carpeta**: Se eliminan todos los archivos individuales previos

## 📝 Licencia

MIT License - ver archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, por favor:

- Abre un [issue](https://github.com/tuusuario/convertidor_imagenes/issues)
- Revisa la [documentación](https://github.com/tuusuario/convertidor_imagenes/wiki)

---

Desarrollado con ❤️ usando Electron + React + TypeScript + Sharp
