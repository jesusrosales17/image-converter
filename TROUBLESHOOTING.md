# Solución de Problemas con Sharp

## Error: "Sharp no está disponible. La conversión de imágenes no funciona en esta plataforma"

Este error indica que Sharp no se puede cargar en la aplicación empaquetada para Windows.

### Síntomas
- La aplicación se abre correctamente
- La interfaz funciona pero al intentar convertir imágenes aparece el error
- Funciona en desarrollo pero falla en el ejecutable empaquetado

### Soluciones Implementadas

#### 1. Carga Robusta de Sharp
- El código ahora intenta cargar Sharp desde múltiples ubicaciones
- Verificación automática de funcionamiento de Sharp
- Manejo de errores mejorado

#### 2. Scripts de Build Específicos
El proyecto incluye scripts específicos para cada plataforma:

```bash
# Limpiar completamente (incluyendo Sharp)
npm run clean

# Build específico para Windows
npm run dist:win

# Build específico para Linux  
npm run dist:linux

# Build específico para macOS
npm run dist:mac
```

#### 3. Configuración Automática
- `scripts/beforePack.js` se ejecuta automáticamente durante el empaquetado
- `scripts/postinstall.js` se ejecuta después de `npm install`
- Reconstrucción automática de Sharp para la plataforma objetivo

#### 4. Verificación
```bash
# Verificar si Sharp funciona
npm run test:sharp
```

### Proceso de Build Recomendado

Para generar un ejecutable para Windows desde Linux:

```bash
# 1. Limpiar todo
npm run clean

# 2. Reinstalar dependencias (activa post-install)
npm install

# 3. Verificar Sharp
npm run test:sharp

# 4. Build para Windows
npm run dist:win
```

### Configuración Técnica

#### electron-builder
```json
{
  "asarUnpack": ["node_modules/sharp/**/*"],
  "buildDependenciesFromSource": false,
  "nodeGypRebuild": true,
  "npmRebuild": true,
  "beforePack": "scripts/beforePack.js"
}
```

#### Carga de Sharp
La aplicación ahora intenta cargar Sharp desde:
1. `require('sharp')` (método estándar)
2. `process.resourcesPath/node_modules/sharp` (empaquetado)
3. `__dirname/../../node_modules/sharp` (relativo)
4. `process.cwd()/node_modules/sharp` (directorio actual)

### Problemas Comunes

#### 1. "Cannot find module 'sharp'"
```bash
npm install sharp
npm run rebuild:win
```

#### 2. "Sharp installation failed"
```bash
# Limpiar e instalar desde cero
npm run clean
npm install
```

#### 3. "Module was compiled against a different architecture"
```bash
# Reconstruir para la plataforma correcta
npm run rebuild:win  # Para Windows
npm run rebuild:linux  # Para Linux
npm run rebuild:mac  # Para macOS
```

#### 4. En Windows: "sharp.node is not a valid Win32 application"
Esto indica que se empaquetaron los binarios de Linux en lugar de Windows.
```bash
# Asegurar build limpio para Windows
npm run clean
npm run dist:win
```

### Archivos Importantes

- `scripts/beforePack.js` - Configura Sharp antes del empaquetado
- `scripts/postinstall.js` - Configura Sharp después de install
- `scripts/testSharp.js` - Verifica que Sharp funciona
- `src/main/main.ts` - Carga robusta de Sharp

### Si Aún No Funciona

1. **Verificar logs del build**: Buscar errores en la consola durante `npm run dist:win`

2. **Verificar contenido del empaquetado**:
   ```bash
   # Extraer y verificar el contenido (en Windows)
   # Ir a la carpeta win-unpacked/ y verificar:
   # - node_modules/sharp/ existe
   # - node_modules/sharp/lib/ tiene archivos .node
   ```

3. **Build en Windows nativo**: Si es posible, hacer el build directamente en Windows:
   ```bash
   git clone [repositorio]
   npm install
   npm run dist:win
   ```

4. **Logs detallados**:
   ```bash
   # En la aplicación, ver la consola de desarrollador (F12)
   # Buscar mensajes de Sharp en la consola
   ```

### Notas Técnicas

- Sharp es una dependencia nativa que requiere binarios específicos por plataforma
- electron-builder maneja la cross-compilation pero Sharp necesita configuración especial
- Los binarios se extraen del ASAR automáticamente usando `asarUnpack`
- El script `beforePack.js` se ejecuta en el sistema de build, no en el sistema objetivo

### Última Solución de Emergencia

Si nada funciona, temporalmente deshabilitar Sharp:

```typescript
// En src/main/main.ts, línea ~15
const sharpAvailable = false; // Forzar deshabilitado
```

Esto permitirá usar la aplicación sin conversión de imágenes mientras se resuelve el problema.
