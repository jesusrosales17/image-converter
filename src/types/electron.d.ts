// Tipos globales para Electron
export {};

declare global {
  interface Window {
    electronAPI: {
      // Tipos personalizados para las APIs expuestas desde preload
      openFile: () => Promise<string | undefined>;
      saveFile: (data: any) => Promise<string | undefined>;
      onUpdateCounter: (callback: (value: number) => void) => void;
      removeAllListeners: (channel: string) => void;
    }
  }
}
