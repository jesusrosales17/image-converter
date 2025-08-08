const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Script que se ejecuta antes del empaquetado para configurar Sharp correctamente
 */
exports.default = async function(context) {
  console.log('🔧 Configurando Sharp para empaquetado...');
  
  const { electronPlatformName, arch } = context;
  
  console.log(`📦 Plataforma objetivo: ${electronPlatformName}-${arch}`);
  
  try {
    // Verificar si Sharp existe
    const sharpPath = path.join(process.cwd(), 'node_modules', 'sharp');
    
    if (!fs.existsSync(sharpPath)) {
      console.log('❌ Sharp no encontrado, instalando...');
      execSync('npm install sharp', { stdio: 'inherit', cwd: process.cwd() });
    }
    
    // Para Windows, asegurar que tenemos los binarios correctos
    if (electronPlatformName === 'win32') {
      console.log('🪟 Configurando Sharp específicamente para Windows...');
      
      // Reconstruir Sharp para Windows
      execSync('npm rebuild sharp', { 
        stdio: 'inherit',
        cwd: process.cwd(),
        env: {
          ...process.env,
          npm_config_platform: 'win32',
          npm_config_arch: arch,
          npm_config_target_platform: 'win32',
          npm_config_target_arch: arch,
          npm_config_build_from_source: 'false'
        }
      });
      
      // Verificar que existen los archivos necesarios
      const libPath = path.join(sharpPath, 'lib');
      const vendorPath = path.join(sharpPath, 'vendor');
      
      if (fs.existsSync(libPath) && fs.existsSync(vendorPath)) {
        console.log('✅ Directorios de Sharp verificados');
      } else {
        console.warn('⚠️  Directorios de Sharp pueden estar incompletos');
        
        // Intentar instalación específica para Windows
        console.log('🔄 Reinstalando Sharp específicamente...');
        execSync('npm uninstall sharp && npm install sharp', { 
          stdio: 'inherit', 
          cwd: process.cwd() 
        });
      }
    } else {
      // Para otras plataformas, reconstruir normalmente
      execSync('npm rebuild sharp', { stdio: 'inherit', cwd: process.cwd() });
    }
    
    // Verificar funcionalidad básica
    console.log('🔍 Verificando Sharp...');
    try {
      const sharp = require(sharpPath);
      console.log('✅ Sharp cargado para empaquetado');
      console.log('📋 Versión:', sharp.versions?.sharp || 'desconocida');
    } catch (error) {
      console.warn('⚠️  Sharp puede tener problemas:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error configurando Sharp:', error.message);
    console.warn('⚠️  Continuando con el empaquetado - Sharp puede no funcionar');
  }
};

/**
 * Script que se ejecuta antes del empaquetado para configurar Sharp correctamente
 * Se asegura de que Sharp esté compilado para la plataforma objetivo
 */
exports.default = async function(context) {
  console.log('🔧 Configurando Sharp para empaquetado...');
  
  const { electronPlatformName, arch } = context;
  
  console.log(`📦 Plataforma objetivo: ${electronPlatformName}-${arch}`);
  
  try {
    // Limpiar Sharp existente
    const sharpPath = path.join(process.cwd(), 'node_modules', 'sharp');
    if (fs.existsSync(sharpPath)) {
      console.log('�️  Limpiando instalación previa de Sharp...');
      
      // Comando para eliminar Sharp específico por plataforma
      if (process.platform === 'win32') {
        try {
          execSync('rmdir /s /q node_modules\\sharp', { stdio: 'inherit', cwd: process.cwd() });
        } catch (error) {
          console.log('⚠️  Sharp no encontrado para eliminar');
        }
      } else {
        try {
          execSync('rm -rf node_modules/sharp', { stdio: 'inherit', cwd: process.cwd() });
        } catch (error) {
          console.log('⚠️  Sharp no encontrado para eliminar');
        }
      }
    }
    
    // Reinstalar Sharp para la plataforma objetivo
    console.log(`🔄 Instalando Sharp para ${electronPlatformName}-${arch}...`);
    
    const installCommand = `npm install sharp --platform=${electronPlatformName} --arch=${arch} --build-from-source=false`;
    
    execSync(installCommand, { 
      stdio: 'inherit',
      cwd: process.cwd(),
      env: {
        ...process.env,
        npm_config_platform: electronPlatformName,
        npm_config_arch: arch,
        npm_config_target_platform: electronPlatformName,
        npm_config_target_arch: arch,
        npm_config_build_from_source: 'false'
      }
    });
    
    // Verificar la instalación
    console.log('🔍 Verificando instalación de Sharp...');
    const sharpTestPath = path.join(process.cwd(), 'node_modules', 'sharp', 'lib');
    if (fs.existsSync(sharpTestPath)) {
      console.log('✅ Sharp instalado correctamente para empaquetado');
    } else {
      console.warn('⚠️  Sharp puede no estar completamente instalado');
    }
    
  } catch (error) {
    console.error('❌ Error configurando Sharp:', error.message);
    // No fallar el build, solo advertir
    console.warn('⚠️  Continuando con el empaquetado - Sharp puede no funcionar en la aplicación final');
  }
};
