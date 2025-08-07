export {};

declare global {
    interface Window {
        electron: {
            ipcRenderer: {
                invoke: (channel: string, ...args: any[]) => Promise<any>;
                on: (channel: string, listener: (...args: any[]) => void) => void;
                off: (channel: string, listener: (...args: any[]) => void) => void;
            };
        };
    }
}