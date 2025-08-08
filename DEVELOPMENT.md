# Convertidor de Imágenes - Notas de Desarrollo

## 🚀 Quick Start

```bash
# Instalar dependencias
pnpm install
cd src/renderer && pnpm install && cd ../..

# Desarrollo
pnpm run dev

# Build completo
pnpm run build:all

# Build para distribución
pnpm run dist
```

## 🔧 Configuración del Entorno

### 1. Dependencias del Sistema

- Node.js 18+
- Sharp (se instala automáticamente)
- Electron 37+

### 2. Estructura de Carpetas

```
src/
├── main/           # Proceso principal de Electron
│   └── main.ts     # Punto de entrada, IPC handlers, auto-updater
├── preload/        # Scripts de preload para seguridad
│   └── preload.ts  # API expuesta al renderer
├── renderer/       # Proceso de renderizado (React)
│   ├── src/        # Código fuente de React
│   └── dist/       # Build del renderer
└── types/          # Tipos TypeScript compartidos
```

## 🏗️ Arquitectura

### Main Process (`src/main/main.ts`)

- Auto-updater configurado
- IPC handlers para conversión de imágenes
- Escaneo recursivo de carpetas
- Generación de previews con Sharp
- Manejo de diálogos de archivo

### Renderer Process (`src/renderer/`)

- React + TypeScript + Vite
- Zustand para state management
- Shadcn/ui para componentes
- Hooks personalizados para lógica
- Comunicación IPC tipada

### Preload (`src/preload/preload.ts`)

- API segura entre main y renderer
- Exposición controlada de funcionalidades

## 🔄 Flujo de Conversión

1. **Selección**: Usuario selecciona imágenes (individual/múltiple/carpeta)
2. **Preview**: Se generan previews usando Sharp en el main process
3. **Configuración**: Usuario configura formato, calidad, destino
4. **Conversión**: Procesamiento por lotes con feedback en tiempo real
5. **Resultado**: Estado actualizado y notificaciones

## 🎯 Features Implementadas

### Completadas

- [x] Escaneo recursivo de carpetas
- [x] Múltiples modos de selección
- [x] Limpieza automática al cambiar modos
- [x] Generación de previews robusta
- [x] Conversión con Sharp (JPEG, PNG, WebP, AVIF, TIFF)
- [x] Mantenimiento de estructura de carpetas
- [x] Auto-updater configurado
- [x] UI moderna con Shadcn/ui
- [x] Estado global con Zustand
- [x] Feedback en tiempo real
- [x] Documentación completa

### 🎯 Pendientes/Mejoras

- [ ] Tests automatizados
- [ ] Configuraciones avanzadas (redimensionado, filtros)
- [ ] Soporte para más formatos (BMP, GIF)
- [ ] Procesamiento en worker threads
- [ ] Drag & drop mejorado
- [ ] Historial de conversiones
- [ ] Perfiles de configuración guardados

## 🛠️ Comandos de Build

### Desarrollo

```bash
pnpm run dev          # Desarrollo con hot reload
pnpm run watch        # Solo watch del TypeScript
```

### Build

```bash
pnpm run build:all       # Build completo (main + renderer)
pnpm run build:renderer  # Solo renderer
pnpm run build           # Solo main process
```

### Distribución

```bash
pnpm run dist           # Build sin publicar
pnpm run dist:linux     # Solo Linux
pnpm run publish        # Build y publicar a GitHub
```

### Específicos por plataforma

```bash
pnpm run electron:build:linux   # Linux (AppImage, DEB, RPM)
pnpm run electron:build:win     # Windows (NSIS, Portable)
pnpm run electron:build:mac     # macOS (DMG, ZIP)
```

## 🔧 Configuración de Auto-updater

Para configurar auto-actualizaciones en tu propio repositorio:

1. **GitHub Token**:

   ```bash
   export GH_TOKEN="ghp_xxxxxxxxxxxx"
   ```

2. **Actualizar package.json**:

   ```json
   {
     "build": {
       "publish": {
         "provider": "github",
         "owner": "tu-usuario",
         "repo": "convertidor_imagenes"
       }
     }
   }
   ```

3. **Publicar release**:
   ```bash
   pnpm run publish
   ```

## 🐛 Debug

### Main Process

```bash
# Con DevTools
ELECTRON_IS_DEV=1 pnpm run dev

# Con logs
DEBUG=* pnpm run dev
```

### Renderer Process

- DevTools disponibles en la aplicación (Ctrl+Shift+I)
- React DevTools funciona normalmente

## 📝 Notas de Implementación

### State Management

- **Zustand** para estado global de imágenes
- **Hooks personalizados** para lógica específica
- **IPC tipado** para comunicación segura

### Conversión de Imágenes

- **Sharp** para procesamiento (más rápido que canvas)
- **Procesamiento por lotes** con control de concurrencia
- **Manejo de errores** robusto para archivos corruptos

### UI/UX

- **Shadcn/ui** para componentes consistentes
- **Lucide React** para iconos
- **Tailwind CSS** para estilos
- **Feedback visual** en tiempo real

### Seguridad

- **Preload script** para exposición controlada de APIs
- **IPC handlers** validados y tipados
- **Sanitización** de rutas de archivos

---

**Contacto**: Para dudas sobre implementación, revisar el código o crear issues en GitHub.
