"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_updater_1 = require("electron-updater");
const path = __importStar(require("path"));
const shared_1 = require("../types/shared");
const utils_1 = require("../types/utils");
const fs_1 = __importDefault(require("fs"));
// Cargar Sharp de forma segura
let sharp = null;
let sharpAvailable = false;
async function initializeSharp() {
    try {
        // Intentar cargar Sharp desde diferentes ubicaciones
        const possiblePaths = [
            'sharp', // Desarrollo
            path.join(process.resourcesPath, 'sharp'), // Empaquetado - extraResources
            path.join(process.resourcesPath, 'node_modules', 'sharp'), // Empaquetado alternativo
            path.join(__dirname, '..', '..', 'node_modules', 'sharp'), // Relativo al main
            path.join(process.cwd(), 'node_modules', 'sharp') // CWD
        ];
        let sharpModule = null;
        let loadedFrom = '';
        // Log información de debug
        console.log('🔍 Buscando Sharp...');
        console.log('  process.resourcesPath:', process.resourcesPath);
        console.log('  __dirname:', __dirname);
        console.log('  process.cwd():', process.cwd());
        console.log('  app.isPackaged:', require('electron').app.isPackaged);
        for (const sharpPath of possiblePaths) {
            try {
                console.log(`  🔍 Intentando cargar desde: ${sharpPath}`);
                // Verificar si la ruta existe
                if (sharpPath !== 'sharp') {
                    const exists = require('fs').existsSync(sharpPath);
                    console.log(`     Existe: ${exists}`);
                    if (!exists)
                        continue;
                }
                sharpModule = require(sharpPath);
                loadedFrom = sharpPath;
                console.log(`✅ Sharp encontrado en: ${sharpPath}`);
                break;
            }
            catch (err) {
                console.log(`❌ No se pudo cargar Sharp desde: ${sharpPath}`);
                console.log(`   Error: ${err instanceof Error ? err.message : String(err)}`);
                continue;
            }
        }
        if (sharpModule) {
            sharp = sharpModule;
            sharpAvailable = true;
            console.log(`✅ Sharp cargado correctamente desde: ${loadedFrom}`);
            // Verificar que Sharp funciona realmente
            try {
                await sharp({
                    create: {
                        width: 1,
                        height: 1,
                        channels: 3,
                        background: { r: 255, g: 255, b: 255 }
                    }
                }).png().toBuffer();
                console.log('✅ Sharp verificado y funcionando');
                return true;
            }
            catch (testError) {
                console.error('❌ Sharp cargado pero no funciona:', testError);
                sharpAvailable = false;
                return false;
            }
        }
        else {
            throw new Error('No se encontró Sharp en ninguna ubicación');
        }
    }
    catch (error) {
        console.error('❌ Error cargando Sharp:', error);
        console.error('🔧 La conversión de imágenes no estará disponible');
        sharpAvailable = false;
        return false;
    }
}
// Inicializar Sharp al arrancar
initializeSharp();
// Configurar auto-actualizaciones
electron_1.app.on('ready', () => {
    // Solo buscar actualizaciones en producción
    if (electron_1.app.isPackaged) {
        electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
    }
});
// Notificar al renderer si hay una actualización disponible
electron_updater_1.autoUpdater.on('update-available', (info) => {
    electron_1.BrowserWindow.getAllWindows().forEach(win => {
        win.webContents.send('update:available', info);
    });
});
electron_updater_1.autoUpdater.on('update-downloaded', (info) => {
    electron_1.BrowserWindow.getAllWindows().forEach(win => {
        win.webContents.send('update:downloaded', info);
    });
});
// Permitir al renderer forzar la instalación de la actualización
electron_1.ipcMain.on('update:install', () => {
    electron_updater_1.autoUpdater.quitAndInstall();
});
const scanFolderForImages = async (folderPath) => {
    const imagePaths = [];
    const scanDirectory = async (dirPath) => {
        try {
            const items = await fs_1.default.promises.readdir(dirPath, { withFileTypes: true });
            for (const item of items) {
                const fullPath = path.join(dirPath, item.name);
                if (item.isDirectory()) {
                    // Recursivamente escanear subdirectorios
                    await scanDirectory(fullPath);
                }
                else if (item.isFile()) {
                    // Verificar si es una imagen
                    const ext = path.extname(item.name).toLowerCase();
                    if (['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff'].includes(ext)) {
                        imagePaths.push(fullPath);
                    }
                }
            }
        }
        catch (error) {
            console.error(`Error scanning directory ${dirPath}:`, error);
        }
    };
    await scanDirectory(folderPath);
    return imagePaths;
};
function createWindow() {
    const windows = new electron_1.BrowserWindow({
        width: 1000,
        title: "Convertidor de imagenes",
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, '../preload/preload.js')
        },
    });
    //   Cargar la aplicación compilada en lugar de localhost
    if (electron_1.app.isPackaged) {
        // En producción, cargar el HTML compilado
        windows.loadFile(path.join(__dirname, '../../src/renderer/dist/index.html'));
    }
    else {
        // En desarrollo, usar el servidor de desarrollo
        windows.loadURL('http://localhost:5173/');
    }
}
// ipcMain es el proceso principal de Electron que maneja la comunicación entre el proceso principal y los procesos de renderizado
electron_1.ipcMain.handle('dialog:open', async (_, options) => {
    const result = await electron_1.dialog.showOpenDialog(options);
    const isModalDirectory = options.properties?.includes('openDirectory');
    if (isModalDirectory) {
        if (result.canceled || result.filePaths.length === 0) {
            return { canceled: result.canceled, files: [] };
        }
        const selectedFolderPath = result.filePaths[0];
        // Scan the selected folder for images
        const imagePaths = await scanFolderForImages(selectedFolderPath);
        const files = await Promise.all(imagePaths.map(async (filePath) => {
            const stat = fs_1.default.statSync(filePath);
            const type = (0, utils_1.getImageExtension)(filePath);
            return {
                path: filePath,
                name: path.basename(filePath),
                size: stat.size,
                type: type,
                status: shared_1.StatusImage.pending,
                progress: 0
            };
        }));
        return {
            canceled: result.canceled,
            files,
            folderPath: selectedFolderPath,
            isFolderSelection: true
        };
    }
    const files = await Promise.all(result.filePaths.map(async (filePath) => {
        const stat = fs_1.default.statSync(filePath); // para obtener el tamaño
        const type = (0, utils_1.getImageExtension)(filePath);
        return {
            path: filePath,
            name: path.basename(filePath),
            size: stat.size,
            type: type,
            status: shared_1.StatusImage.pending,
            progress: 0
        };
    }));
    return { canceled: result.canceled, files };
});
// generar una vista previa de la imagen en base 64
electron_1.ipcMain.handle('imagePreview:get', async (_, filePath) => {
    if (!sharpAvailable) {
        return {
            preview: '',
            error: 'Sharp no está disponible. La conversión de imágenes no funciona en esta plataforma.',
            name: path.basename(filePath)
        };
    }
    const maxRetries = 3;
    let lastError = null;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            if (!fs_1.default.existsSync(filePath)) {
                throw new Error('El archivo no existe');
            }
            const ext = path.extname(filePath).toLowerCase();
            if (attempt > 1) {
                await new Promise(resolve => setTimeout(resolve, 100 * attempt));
            }
            let sharpInstance = sharp(filePath);
            if (ext === '.tiff' || ext === '.tif') {
                sharpInstance = sharpInstance
                    .ensureAlpha(0) // Normalizar canal alpha
                    .toColorspace('srgb'); // Forzar espacio de color estándar
            }
            const data = await Promise.race([
                sharpInstance
                    .resize(800, 800, {
                    fit: 'inside',
                    withoutEnlargement: true,
                    kernel: sharp.kernel.lanczos3 // Mejor algoritmo de redimensionado
                })
                    .jpeg({
                    quality: 85,
                    progressive: true,
                    mozjpeg: false,
                    optimizeCoding: true,
                    overshootDeringing: false
                })
                    .toBuffer(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout generating preview')), 10000))
            ]);
            if (!data || data.length === 0) {
                throw new Error('Preview data is empty');
            }
            const base64 = `data:image/jpeg;base64,${data.toString('base64')}`;
            //   Validar que el base64 es válido
            if (!base64 || base64.length < 100) {
                throw new Error('Invalid base64 data generated');
            }
            return {
                preview: base64,
                name: path.basename(filePath)
            };
        }
        catch (error) {
            lastError = error;
            const filename = path.basename(filePath);
            // Si no es el último intento, continuar con el siguiente
            if (attempt < maxRetries) {
                continue;
            }
        }
    }
    // Si llegamos aquí, todos los intentos fallaron
    const filename = path.basename(filePath);
    const ext = path.extname(filePath).toUpperCase();
    console.error(`❌ Error generando preview para ${filename} después de ${maxRetries} intentos:`, lastError);
    return {
        preview: '',
        error: `No se pudo generar preview para ${ext} después de ${maxRetries} intentos`,
        name: filename
    };
});
// optener ruta de la carpeta del destino
electron_1.ipcMain.handle('dialog:openFolderForOutput', async (_, options) => {
    const result = await electron_1.dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    if (result) {
        return result.filePaths[0];
    }
    return '';
});
electron_1.ipcMain.handle('convert:images', async (event, { images, outputFormat, quality, outputFolder, isFolderConversion, folderPath }) => {
    if (!sharpAvailable) {
        throw new Error("Sharp no está disponible. La conversión de imágenes no funciona en esta plataforma.");
    }
    let convertedCount = 0;
    let failedCount = 0;
    let results = [];
    if (!images || images.length === 0) {
        throw new Error("No hay imágenes seleccionadas");
    }
    if (!outputFormat || !outputFolder) {
        throw new Error("Formato de salida o carpeta de salida no especificados");
    }
    // Verificar que la carpeta de salida existe
    if (!fs_1.default.existsSync(outputFolder)) {
        throw new Error("La carpeta de salida no existe");
    }
    // Si es conversión por carpeta, usar folderPath directamente
    const isConversionByFolder = isFolderConversion || (folderPath && fs_1.default.existsSync(folderPath));
    const baseFolderPath = folderPath || ''; //   folderPath ES el ancestro común más profundo
    // enviar el evento de inicio de la conversion
    event.sender.send('conversion:started', {
        total: images.length,
        outputFormat,
        outputFolder,
        isFolderConversion: isConversionByFolder
    });
    // procesar las imagenes una por una
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        try {
            event.sender.send('conversion:imageStarted', {
                imagePath: image.path,
                currentIndex: i + 1,
                total: images.length
            });
            const inputPath = image.path;
            const baseName = path.basename(inputPath, path.extname(inputPath));
            let outputPath;
            if (isConversionByFolder && baseFolderPath) {
                // Obtener la ruta relativa desde la carpeta base
                const relativePath = path.relative(baseFolderPath, inputPath);
                const relativeDir = path.dirname(relativePath);
                // Crear la estructura de carpetas en el destino
                const outputDir = relativeDir === '.'
                    ? outputFolder
                    : path.join(outputFolder, relativeDir);
                // Crear directorio si no existe
                if (!fs_1.default.existsSync(outputDir)) {
                    await fs_1.default.promises.mkdir(outputDir, { recursive: true });
                }
                outputPath = path.join(outputDir, `${baseName}.${outputFormat}`);
            }
            else {
                // 📄 Conversión individual - guardar directamente en carpeta de salida
                outputPath = path.join(outputFolder, `${baseName}.${outputFormat}`);
            }
            // validar que la imagen del mismo tipo no este en la misma ruta de salida
            if (fs_1.default.existsSync(outputPath)) {
                // si la imagen es del mismo tipo a convertir marcar automaticamente en completada
                results.push({
                    originalPath: inputPath,
                    outputPath,
                    success: true
                });
                convertedCount++;
                event.sender.send('conversion:imageCompleted', {
                    imagePath: inputPath,
                    outputPath,
                    success: true,
                    currentIndex: i + 1,
                    total: images.length
                });
                continue;
            }
            let sharpInstance = sharp(inputPath);
            const inputExt = path.extname(inputPath).toLowerCase();
            if (inputExt === '.tiff' || inputExt === '.tif') {
                sharpInstance = sharpInstance
                    .removeAlpha()
                    .toColorspace('srgb'); // Forzar espacio de color estándar
            }
            switch (outputFormat) {
                case 'jpeg':
                case 'jpg':
                    sharpInstance = sharpInstance.jpeg({
                        quality,
                        progressive: true,
                        mozjpeg: true
                    });
                    break;
                case 'webp':
                    sharpInstance = sharpInstance.webp({
                        quality,
                        effort: 6 // Mejor compresión
                    });
                    break;
                case 'png':
                    sharpInstance = sharpInstance.png({
                        compressionLevel: 6,
                        progressive: true
                    });
                    break;
                case 'avif':
                    sharpInstance = sharpInstance.avif({
                        quality,
                        effort: 6
                    });
                    break;
                case 'tiff':
                    sharpInstance = sharpInstance.tiff({
                        quality,
                        compression: 'jpeg'
                    });
                    break;
                default:
                    throw new Error(`Formato de salida no soportado: ${outputFormat}`);
            }
            await sharpInstance.toFile(outputPath);
            results.push({
                originalPath: inputPath,
                outputPath,
                success: true
            });
            convertedCount++;
            //   Evento de imagen completada
            event.sender.send('conversion:imageCompleted', {
                imagePath: inputPath,
                outputPath,
                success: true,
                currentIndex: i + 1,
                total: images.length
            });
            console.log(`  Converted: ${inputPath} → ${outputPath}`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            results.push({
                originalPath: image.path,
                success: false,
                error: errorMessage
            });
            failedCount++;
            //   Evento de imagen con error
            event.sender.send('conversion:imageError', {
                imagePath: image.path,
                error: errorMessage,
                success: false,
                currentIndex: i + 1,
                total: images.length
            });
            console.error(`❌ Failed to convert ${image.path}:`, error);
        }
    }
    // enviar el evento de finalizacion de la conversion
    console.log('🏁 Enviando evento de conversión finalizada...');
    console.log(`📊 Estadísticas: ${convertedCount} exitosas, ${failedCount} fallidas de ${images.length} total`);
    event.sender.send('conversion:finished', {
        total: images.length,
        convertedCount,
        failedCount,
        results
    });
    return {
        success: failedCount === 0,
        convertedCount,
        failedCount,
        details: results
    };
});
electron_1.app.whenReady().then(() => {
    // crear la ventana principal
    createWindow();
    // abir una nueva ventana cuando se haga clic en el icono de la aplicacion en el dock (macOS)
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
// cerrar la aplicacion cuando todas las ventanas esten cerradas en sistemas que no sean macOS
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
//# sourceMappingURL=main.js.map