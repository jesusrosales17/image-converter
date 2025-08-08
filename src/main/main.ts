import { BrowserWindow, app, ipcMain, dialog, nativeImage } from "electron";
import * as path from "path";
import { DialogResult, ImagePreviewResult } from '../renderer/src/interfaces/fileDialog';
import fs from 'fs';
import { getImageExtension } from '../renderer/src/utils/image';
import { StatusImage } from '../../dist/renderer/src/interfaces/images';
import { ConversionOptions, ConversionResult } from '../types/conversion';
import sharp from "sharp";

const scanFolderForImages = async (folderPath: string): Promise<string[]> => {
  const imagePaths: string[] = [];
  
  const scanDirectory = async (dirPath: string) => {
    try {
      const items = await fs.promises.readdir(dirPath, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        
        if (item.isDirectory()) {
          // Recursivamente escanear subdirectorios
          await scanDirectory(fullPath);
        } else if (item.isFile()) {
          // Verificar si es una imagen
          const ext = path.extname(item.name).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff'].includes(ext)) {
            imagePaths.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error);
    }
  };
  
  await scanDirectory(folderPath);
  return imagePaths;
};

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
    const isModalDirectory = options.properties?.includes('openDirectory');

    if (isModalDirectory) {
        if (result.canceled || result.filePaths.length === 0) {
            return { canceled: result.canceled, files: [] };
        }
        
        const selectedFolderPath = result.filePaths[0];
        
        // Scan the selected folder for images
        const imagePaths = await scanFolderForImages(selectedFolderPath);
        
        const files = await Promise.all(imagePaths.map(async filePath => {
            const stat = fs.statSync(filePath);
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
        
        return { 
            canceled: result.canceled, 
            files,
            folderPath: selectedFolderPath, 
            isFolderSelection: true        
        };
    }

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
    if (!fs.existsSync(filePath)) {
      throw new Error('El archivo no existe');
    }

    const data = await sharp(filePath).toBuffer();
    const ext = path.extname(filePath).slice(1); // sin el punto
    const mime = ext === 'jpg' ? 'jpeg' : ext;
    const base64 = `data:image/${mime};base64,${data.toString('base64')}`;

    return {
      preview: base64,
      name: path.basename(filePath)
    };
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

ipcMain.handle('convert:images', async (event, { images, outputFormat, quality, outputFolder, isFolderConversion, folderPath }: ConversionOptions): Promise<ConversionResult> => {
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

    // Si es conversión por carpeta, usar folderPath directamente
    const isConversionByFolder = isFolderConversion || (folderPath && fs.existsSync(folderPath));
    const baseFolderPath = folderPath || ''; // ✅ folderPath ES el ancestro común más profundo
    
   

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

            let outputPath: string;

            if (isConversionByFolder && baseFolderPath) {
                // Obtener la ruta relativa desde la carpeta base
                const relativePath = path.relative(baseFolderPath, inputPath);
                const relativeDir = path.dirname(relativePath);
                
                // Crear la estructura de carpetas en el destino
                const outputDir = relativeDir === '.' 
                    ? outputFolder 
                    : path.join(outputFolder, relativeDir);
                
                // Crear directorio si no existe
                if (!fs.existsSync(outputDir)) {
                    await fs.promises.mkdir(outputDir, { recursive: true });
                }
                
                outputPath = path.join(outputDir, `${baseName}.${outputFormat}`);
            } else {
                // 📄 Conversión individual - guardar directamente en carpeta de salida
                outputPath = path.join(outputFolder, `${baseName}.${outputFormat}`);
            }


            // validar que la imagen del mismo tipo no este en la misma ruta de salida
            if (fs.existsSync(outputPath)) {
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

            switch (outputFormat) {
                case 'jpeg':
                case 'jpg': // ✅ Ambos casos usan la misma lógica
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