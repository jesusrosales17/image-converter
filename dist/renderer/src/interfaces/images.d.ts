import type { ImagePreviewResult } from "./fileDialog";
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
export type OutputFormat = "webp" | "avif" | "jpeg" | "png" | "tiff";
export interface ImageStore {
    images: ImageFile[];
    outputFormat: OutputFormat;
    isConverting: boolean;
    quality: number;
    outputFolder: string;
    imageToShow?: string;
    isFolderConversion: boolean;
    sourceFolderPath: string;
    setImages: (images: ImageFile[]) => void;
    setIsConverting: (isConverting: boolean) => void;
    setQuality: (quality: number) => void;
    setOutputFolder: (folder: string) => void;
    setOutputFormat: (format: OutputFormat) => void;
    setImageToShow: (image: string) => void;
    setIsFolderConversion: (isFolderConversion: boolean) => void;
    setSourceFolderPath: (path: string) => void;
    updateImageStatus: (path: string, status: StatusImage, progress: number) => void;
    addImage: (image: ImageFile) => void;
    removeImage: (path: string) => void;
    clearImages: () => void;
    imagePreview: (filePath: string) => Promise<ImagePreviewResult>;
}
//# sourceMappingURL=images.d.ts.map