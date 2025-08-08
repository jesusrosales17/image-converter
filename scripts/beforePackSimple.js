const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Script simplificado para configurar Sharp antes del empaquetado
 */
exports.default = async function(context) {
  console.log('🔧 Configurando Sharp para empaquetado (modo simplificado)...');
  
  const { electronPlatformName, arch } = context;
  console.log(`📦 Plataforma objetivo: ${electronPlatformName}-${arch}`);
  
  try {
    const sharpPath = path.join(process.cwd(), 'node_modules', 'sharp');
    
    // Solo verificar que Sharp existe, no reconstruir durante el empaquetado
    if (fs.existsSync(sharpPath)) {
      console.log('✅ Sharp encontrado en node_modules');
      
      // Verificar directorios críticos
      const libPath = path.join(sharpPath, 'lib');
      const vendorPath = path.join(sharpPath, 'vendor');
      
      if (fs.existsSync(libPath)) {
        console.log('✅ Directorio lib/ de Sharp existe');
      } else {
        console.warn('⚠️  Directorio lib/ de Sharp no encontrado');
      }
      
      if (fs.existsSync(vendorPath)) {
        console.log('✅ Directorio vendor/ de Sharp existe');
      } else {
        console.warn('⚠️  Directorio vendor/ de Sharp no encontrado');
      }
      
      // Solo verificar, no recompilar
      try {
        const sharp = require(sharpPath);
        console.log('✅ Sharp se puede cargar para empaquetado');
        console.log('📋 Versión:', sharp.versions?.sharp || 'desconocida');
      } catch (error) {
        console.warn('⚠️  Sharp no se puede cargar:', error.message);
        console.warn('📝 Se empaquetará de todas formas...');
      }
      
    } else {
      console.error('❌ Sharp no encontrado en node_modules');
      console.error('💡 Ejecuta: npm install sharp');
    }
    
  } catch (error) {
    console.error('❌ Error verificando Sharp:', error.message);
    console.warn('⚠️  Continuando con el empaquetado...');
  }
  
  console.log('🎯 Configuración de Sharp completada');
};
