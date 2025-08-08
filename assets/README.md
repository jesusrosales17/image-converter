# Iconos de la Aplicación

Para que la aplicación tenga iconos correctos en todas las plataformas, necesitas crear los siguientes archivos:

## Archivos Requeridos

```
assets/
├── icon.png      # 512x512 PNG (para Linux)
├── icon.ico      # ICO multi-tamaño (para Windows)
└── icon.icns     # ICNS (para macOS)
```

## Tamaños Recomendados

### PNG (Linux)
- **Tamaño**: 512x512 píxeles
- **Formato**: PNG con transparencia
- **Uso**: AppImage, DEB, RPM

### ICO (Windows)
- **Tamaños incluidos**: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256
- **Formato**: ICO multi-resolución
- **Uso**: Ejecutable de Windows, installer

### ICNS (macOS)
- **Tamaños incluidos**: 16x16, 32x32, 128x128, 256x256, 512x512, 1024x1024
- **Formato**: ICNS de Apple
- **Uso**: Aplicación macOS

## Herramientas para Crear Iconos

### Online (Fácil)
- [favicon.io](https://favicon.io/favicon-generator/) - Genera todos los formatos
- [iconverticons.com](https://iconverticons.com/) - Conversión entre formatos
- [cloudconvert.com](https://cloudconvert.com/) - Convertidor universal

### Software Gratuito
- **GIMP** - Puede exportar a ICO
- **Paint.NET** (Windows) - Plugin para ICO
- **Preview** (macOS) - Puede crear ICNS

### Línea de Comandos
```bash
# Crear ICO desde PNG (ImageMagick)
convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico

# Crear ICNS desde PNG (iconutil en macOS)
mkdir icon.iconset
sips -z 16 16 icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32 icon.png --out icon.iconset/icon_16x16@2x.png
# ... (más tamaños)
iconutil -c icns icon.iconset
```

## Diseño Recomendado

Para un convertidor de imágenes, considera:
- **Colores**: Azul/verde (profesional), gradientes sutiles
- **Elementos**: Iconos de imagen, flechas de conversión, engranajes
- **Estilo**: Moderno, minimalista, fácil de reconocer en tamaños pequeños
- **Fondo**: Transparente o sólido que funcione en temas claros/oscuros

## Ejemplo de Diseño (SVG Base)

```svg
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo circular -->
  <circle cx="256" cy="256" r="240" fill="url(#gradient)" />
  
  <!-- Gradiente -->
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6" />
      <stop offset="100%" style="stop-color:#1E40AF" />
    </linearGradient>
  </defs>
  
  <!-- Icono de imagen -->
  <rect x="160" y="180" width="120" height="90" rx="8" fill="white" opacity="0.9" />
  <circle cx="180" cy="205" r="8" fill="#3B82F6" />
  <polygon points="160,250 200,220 240,240 280,200 280,270 160,270" fill="#E5E7EB" />
  
  <!-- Flecha de conversión -->
  <path d="M320 230 L380 256 L320 282 L320 265 L300 265 L300 247 L320 247 Z" fill="white" />
  
  <!-- Texto opcional -->
  <text x="256" y="350" text-anchor="middle" fill="white" font-family="sans-serif" font-size="24" font-weight="bold">CONVERT</text>
</svg>
```

## Instrucciones de Uso

1. **Crea tu diseño** usando las herramientas mencionadas
2. **Genera los 3 formatos** (PNG, ICO, ICNS) 
3. **Colócalos en la carpeta `assets/`**
4. **Ejecuta el build** - electron-builder los usará automáticamente

Los iconos se aplicarán automáticamente cuando ejecutes:
```bash
pnpm run electron:build
```

## Nota
Sin iconos personalizados, electron-builder usará iconos por defecto de Electron. Para una aplicación profesional, es altamente recomendado crear iconos personalizados.
