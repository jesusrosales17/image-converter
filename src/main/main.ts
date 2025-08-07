import { BrowserWindow, app, ipcMain, dialog } from "electron";
import * as path from "path";
import { DialogResult } from '../renderer/src/interfaces/fileDialog';

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

    return {
        canceled: result.canceled,
        filePaths: result.filePaths
    }; 
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