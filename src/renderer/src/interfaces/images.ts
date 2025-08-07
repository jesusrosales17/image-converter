export type ImageFile = {
    path: string;
    name: string;
}

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