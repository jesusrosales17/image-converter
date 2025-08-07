export declare const StatusImage: {
    pending: string;
    processing: string;
    completed: string;
    error: string;
};
export type StatusImage = typeof StatusImage[keyof typeof StatusImage];
export type ImageFile = {
    path: string;
    name: string;
    size?: number;
    type?: string;
    preview?: string;
    status?: StatusImage;
    progress?: number;
};
export type OutputFormal = "webp" | "avif" | "jpeg" | "png" | "bmp" | "tiff";
export interface ImageStore {
    images: ImageFile[];
    outputFormat: OutputFormal;
    isConverting: boolean;
    quality: number;
    outputFolder: string;
    setImages: (images: ImageFile[]) => void;
    setIsConverting: (isConverting: boolean) => void;
    setQuality: (quality: number) => void;
    setOutputFolder: (folder: string) => void;
    setOutputFormat: (format: OutputFormal) => void;
    addImage: (image: ImageFile) => void;
    removeImage: (path: string) => void;
    clearImages: () => void;
}
//# sourceMappingURL=images.d.ts.map