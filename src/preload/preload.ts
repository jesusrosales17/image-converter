import { contextBridge, ipcRenderer } from 'electron';

// Exponer APIs seguras al proceso renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Ejemplo de API para comunicación con el proceso principal
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (data: any) => ipcRenderer.invoke('dialog:saveFile', data),
  
  // Ejemplo de listener para eventos del proceso principal
  onUpdateCounter: (callback: (value: number) => void) => {
    ipcRenderer.on('update-counter', (_event, value) => callback(value));
  },
  
  // Remover listeners
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// Declaración de tipos para TypeScript
declare global {
  interface Window {
    electronAPI: {
      openFile: () => Promise<string | undefined>;
      saveFile: (data: any) => Promise<string | undefined>;
      onUpdateCounter: (callback: (value: number) => void) => void;
      removeAllListeners: (channel: string) => void;
    }
  }
}
