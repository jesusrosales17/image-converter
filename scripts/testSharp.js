const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Script para verificar si Sharp está funcionando correctamente
 */
async function testSharp() {
  console.log('🔍 Verificando instalación de Sharp...');
  
  try {
    // Información básica
    console.log('📋 Información de Sharp:');
    console.log('  Versión:', sharp.versions.sharp);
    console.log('  Vips:', sharp.versions.vips);
    console.log('  Plataforma:', process.platform, process.arch);
    
    // Probar crear una imagen simple
    console.log('🧪 Probando funcionalidad básica...');
    const testBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 255, g: 0, b: 0 }
      }
    })
    .png()
    .toBuffer();
    
    if (testBuffer && testBuffer.length > 0) {
      console.log('✅ Sharp funciona correctamente');
      console.log('📦 Tamaño del buffer de prueba:', testBuffer.length, 'bytes');
      
      // Verificar formatos soportados
      console.log('🎨 Formatos soportados:');
      const formats = sharp.format;
      Object.keys(formats).forEach(format => {
        if (formats[format].input.buffer || formats[format].output.buffer) {
          console.log(`  ${format}: ✓`);
        }
      });
      
      return true;
    } else {
      console.error('❌ Sharp no generó output válido');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error probando Sharp:', error.message);
    console.error('📍 Stack trace:', error.stack);
    
    // Información de diagnóstico
    console.log('\n🔧 Información de diagnóstico:');
    console.log('  Node.js:', process.version);
    console.log('  Plataforma:', process.platform, process.arch);
    console.log('  CWD:', process.cwd());
    
    const sharpPath = path.join(process.cwd(), 'node_modules', 'sharp');
    if (fs.existsSync(sharpPath)) {
      console.log('  Sharp directory exists: ✓');
      
      const libPath = path.join(sharpPath, 'lib');
      if (fs.existsSync(libPath)) {
        console.log('  Sharp lib directory exists: ✓');
        try {
          const files = fs.readdirSync(libPath);
          console.log('  Archivos en lib:', files.slice(0, 5).join(', '), files.length > 5 ? '...' : '');
        } catch (err) {
          console.log('  Error listando archivos lib:', err.message);
        }
      } else {
        console.log('  Sharp lib directory: ❌');
      }
    } else {
      console.log('  Sharp directory: ❌');
    }
    
    return false;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  testSharp().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = testSharp;
