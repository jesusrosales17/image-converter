const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 Ejecutando post-install para Sharp...');

try {
  // Verificar si Sharp está instalado
  const sharpPath = path.join(process.cwd(), 'node_modules', 'sharp');
  
  if (!fs.existsSync(sharpPath)) {
    console.log('❌ Sharp no encontrado, instalando...');
    execSync('npm install sharp', { stdio: 'inherit' });
  }
  
  // Reconstruir Sharp para la plataforma actual
  console.log('🔄 Reconstruyendo Sharp...');
  execSync('npm rebuild sharp', { stdio: 'inherit' });
  
  // Verificar la instalación
  try {
    const sharp = require('sharp');
    console.log('✅ Sharp post-install completado exitosamente');
    console.log('📋 Versión:', sharp.versions?.sharp || 'desconocida');
  } catch (error) {
    console.warn('⚠️  Sharp instalado pero puede tener problemas:', error.message);
  }
  
} catch (error) {
  console.error('❌ Error en post-install de Sharp:', error.message);
  console.log('⚠️  Continuando sin Sharp...');
}
