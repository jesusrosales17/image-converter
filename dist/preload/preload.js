"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Exponer APIs seguras al proceso renderer
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // Ejemplo de API para comunicación con el proceso principal
    openFile: () => electron_1.ipcRenderer.invoke('dialog:openFile'),
    saveFile: (data) => electron_1.ipcRenderer.invoke('dialog:saveFile', data),
    // Ejemplo de listener para eventos del proceso principal
    onUpdateCounter: (callback) => {
        electron_1.ipcRenderer.on('update-counter', (_event, value) => callback(value));
    },
    // Remover listeners
    removeAllListeners: (channel) => {
        electron_1.ipcRenderer.removeAllListeners(channel);
    }
});
//# sourceMappingURL=preload.js.map