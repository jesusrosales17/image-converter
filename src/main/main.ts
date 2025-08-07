import { BrowserWindow, app, ipcMain, dialog, nativeImage } from "electron";
import * as path from "path";
import { DialogResult, ImagePreviewResult } from '../renderer/src/interfaces/fileDialog';
import fs from 'fs';
import { getImageExtension } from '../renderer/src/utils/image';
import { StatusImage } from '../../dist/renderer/src/interfaces/images';



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
            status:  StatusImage.pending,
            progress: 0
        };
    }));

    return {canceled: result.canceled,  files};
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

    if(result) {
        return result.filePaths[0]
    }

    

    return '';
});

app.whenReady().then( () => {
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