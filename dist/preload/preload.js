"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        invoke: (channel, ...args) => electron_1.ipcRenderer.invoke(channel, ...args),
        on: (channel, listener) => {
            //   Arreglar el callback para pasar los argumentos correctamente
            electron_1.ipcRenderer.on(channel, (_, ...args) => listener(...args));
        },
        off: (channel, listener) => {
            electron_1.ipcRenderer.off(channel, listener);
        },
    }
});
//# sourceMappingURL=preload.js.map