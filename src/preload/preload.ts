import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
    on: (channel: string, listener: (...args: any[]) => void) => {
      //   Arreglar el callback para pasar los argumentos correctamente
      ipcRenderer.on(channel, (_, ...args) => listener(...args));
    },
    off: (channel: string, listener: (...args: any[]) => void) => {
      ipcRenderer.off(channel, listener);
    },
  }
});