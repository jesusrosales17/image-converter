declare global {
    interface Window {
        electronAPI: {
            openFile: () => Promise<string | undefined>;
            saveFile: (data: any) => Promise<string | undefined>;
            onUpdateCounter: (callback: (value: number) => void) => void;
            removeAllListeners: (channel: string) => void;
        };
    }
}
export {};
//# sourceMappingURL=preload.d.ts.map