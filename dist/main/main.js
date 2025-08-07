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
const path = __importStar(require("path"));
const fs_1 = __importDefault(require("fs"));
const image_1 = require("../renderer/src/utils/image");
const images_1 = require("../../dist/renderer/src/interfaces/images");
const sharp_1 = __importDefault(require("sharp"));
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
    windows.loadURL('http://localhost:5173/');
}
// ipcMain es el proceso principal de Electron que maneja la comunicación entre el proceso principal y los procesos de renderizado
electron_1.ipcMain.handle('dialog:open', async (_, options) => {
    const result = await electron_1.dialog.showOpenDialog(options);
    const files = await Promise.all(result.filePaths.map(async (filePath) => {
        const stat = fs_1.default.statSync(filePath); // para obtener el tamaño
        const type = (0, image_1.getImageExtension)(filePath);
        return {
            path: filePath,
            name: path.basename(filePath),
            size: stat.size,
            type: type,
            status: images_1.StatusImage.pending,
            progress: 0
        };
    }));
    return { canceled: result.canceled, files };
});
// generar una vista previa de la imagen en base 64
electron_1.ipcMain.handle('imagePreview:get', async (_, filePath) => {
    try {
        if (fs_1.default.existsSync(filePath)) {
            const image = electron_1.nativeImage.createFromPath(filePath);
            return {
                preview: image.toDataURL(),
                name: path.basename(filePath)
            };
        }
        else {
            throw new Error('File does not exist');
        }
    }
    catch (error) {
        console.error('Error loading image preview:', error);
        return {
            preview: '',
            error: "Error al obtener la vista previa de la imagen",
            name: path.basename(filePath)
        };
    }
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
electron_1.ipcMain.handle('convert:images', async (_, { images, outputFormat, quality, outputFolder }) => {
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
    // procesar las imagenes una por una
    for (const image of images) {
        try {
            // simular error con la primera imagen
            const inputPath = image.path;
            const baseName = path.basename(inputPath, path.extname(inputPath));
            const outputPath = path.join(outputFolder, `${baseName}.${outputFormat}`);
            let sharpInstance = (0, sharp_1.default)(inputPath);
            switch (outputFormat) {
                case 'jpeg':
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
                        quality,
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
            console.log(`✅ Converted: ${inputPath} → ${outputPath}`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            results.push({
                originalPath: image.path,
                success: false,
                error: errorMessage
            });
            failedCount++;
            console.error(`❌ Failed to convert ${image.path}:`, error);
        }
    }
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