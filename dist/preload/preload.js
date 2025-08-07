"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        invoke: (channel, ...args) => electron_1.ipcRenderer.invoke(channel, ...args)
    }
});
//# sourceMappingURL=preload.js.map