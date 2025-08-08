# Convertidor de Imágenes - Notas de Desarrollo

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install
cd src/renderer && npm install && cd ../..

# Desarrollo
# 1. Ejecuta el servidor de React (renderer)
cd src/renderer
npm run dev
# 2. En otra terminal, ejecuta el main process (carpeta raíz)
cd ../..
npm run dev
```

## 🔧 Estructura y Arquitectura

- **Main Process**: Electron, IPC, auto-updater, conversión con Sharp
- **Renderer**: React + Zustand + Vite, UI moderna, comunicación IPC
- **Preload**: API segura entre main y renderer

## 🔄 Flujo de Conversión

1. Selección de imágenes (individual/múltiple/carpeta)
2. Previews con Sharp
3. Configuración de formato/calidad/destino
4. Conversión por lotes con feedback en tiempo real
5. Resultados y notificaciones

## 🛠️ Comandos Útiles

```bash
npm run dev          # Desarrollo con hot reload
npm run build:all    # Build completo (main + renderer)

npm run dist:linux   # Solo Linux
npm run dist:win     # Solo Windows
npm run dist:mac     # Solo macOS
npm run publish      # Publicar release a GitHub
```

## 🔧 Auto-actualizaciones

- Configura `GH_TOKEN` y el bloque `publish` en package.json para tu repo.
- Usa `npm run publish` para releases automáticos.

## 🐛 Debug

- Main: `ELECTRON_IS_DEV=1 npm run dev`
- Renderer: DevTools (Ctrl+Shift+I)

## 📝 Notas

- Zustand para estado global
- Sharp para conversión eficiente
- UI con Shadcn/ui y Tailwind
- Seguridad con preload y IPC tipado

---

Contacto: revisa el código o crea issues en GitHub.
