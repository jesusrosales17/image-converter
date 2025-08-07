import { BrowserWindow, app, ipcMain, dialog, nativeImage } from "electron";
import * as path from "path";
import { DialogResult, ImagePreviewResult } from '../renderer/src/interfaces/fileDialog';
import fs from 'fs';
import { getImageExtension } from '../renderer/src/utils/image';
import { StatusImage } from '../../dist/renderer/src/interfaces/images';
import { ConversionOptions, ConversionResult } from '../types/conversion';
import sharp from "sharp";



function createWindow(): void {
    const windows = new BrowserWindow({
        width: 1000,
        title: "Convertidor de imagenes",
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, '../preload/preload.js')
        },
    })

    windows.loadURL('http://localhost:5173/');
}

// ipcMain es el proceso principal de Electron que maneja la comunicación entre el proceso principal y los procesos de renderizado

ipcMain.handle('dialog:open', async (_, options): Promise<DialogResult> => {
    const result = await dialog.showOpenDialog(options);

    const files = await Promise.all(result.filePaths.map(async filePath => {
        const stat = fs.statSync(filePath); // para obtener el tamaño
        const type = getImageExtension(filePath);
        return {
            path: filePath,
            name: path.basename(filePath),
            size: stat.size,
            type: type,
            status: StatusImage.pending,
            progress: 0
        };
    }));

    return { canceled: result.canceled, files };
});


// generar una vista previa de la imagen en base 64
ipcMain.handle('imagePreview:get', async (_, filePath: string): Promise<ImagePreviewResult> => {
    try {
        if (fs.existsSync(filePath)) {
            const image = nativeImage.createFromPath(filePath);
            return {
                preview: image.toDataURL(),
                name: path.basename(filePath)
            };
        } else {
            throw new Error('File does not exist');
        }
    } catch (error) {
        console.error('Error loading image preview:', error);
        return {
            preview: '',
            error: "Error al obtener la vista previa de la imagen",
            name: path.basename(filePath)
        };
    }
})


// optener ruta de la carpeta del destino
ipcMain.handle('dialog:openFolderForOutput', async (_, options): Promise<string> => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if (result) {
        return result.filePaths[0]
    }



    return '';
});

ipcMain.handle('convert:images', async (event, { images, outputFormat, quality, outputFolder }: ConversionOptions): Promise<ConversionResult> => {
    let convertedCount = 0;
    let failedCount = 0;
    let results: ConversionResult['details'] = [];
    if (!images || images.length === 0) {
        throw new Error("No hay imágenes seleccionadas");
    }

    if (!outputFormat || !outputFolder) {
        throw new Error("Formato de salida o carpeta de salida no especificados");
    }

    // Verificar que la carpeta de salida existe
    if (!fs.existsSync(outputFolder)) {
        throw new Error("La carpeta de salida no existe");
    }

    // enviar el evento de inicio de la conversion
    console.log('Iniciando conversión de imágenes...');
    event.sender.send('conversion:started', {
        total: images.length,
        outputFormat,
        outputFolder
    });

    // procesar las imagenes una por una
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        try {
            // ✅ Arreglar typo: convension → conversion
            event.sender.send('conversion:imageStarted', {
                imagePath: image.path,
                currentIndex: i + 1,
                total: images.length
            });
        
            const inputPath = image.path;
            const baseName = path.basename(inputPath, path.extname(inputPath));
            const outputPath = path.join(outputFolder, `${baseName}.${outputFormat}`);

            let sharpInstance = sharp(inputPath);

            switch (outputFormat) {
               
                case 'jpeg': // ✅ Agregar soporte para 'jpg'
                    sharpInstance = sharpInstance.jpeg({
                        quality,
                        progressive: true,
                        mozjpeg: true
                    });
                case 'jpg': // ✅ Agregar soporte para 'jpg'
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

            // ✅ Evento de imagen completada
            event.sender.send('conversion:imageCompleted', {
                imagePath: inputPath,
                outputPath,
                success: true,
                currentIndex: i + 1,
                total: images.length
            });

            console.log(`✅ Converted: ${inputPath} → ${outputPath}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

            results.push({
                originalPath: image.path,
                success: false,
                error: errorMessage
            });

            failedCount++;
            
            // ✅ Evento de imagen con error
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

app.whenReady().then(() => {
    // crear la ventana principal
    createWindow();

    // abir una nueva ventana cuando se haga clic en el icono de la aplicacion en el dock (macOS)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
})

// cerrar la aplicacion cuando todas las ventanas esten cerradas en sistemas que no sean macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})