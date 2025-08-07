import type { ImageFile } from "@/interfaces/images";

export const formatImageInfo = (path: string): ImageFile => {
    // obtener nombre sin extensión
    const fileName = path.split('/').pop() || '';
    // const fileName = path.split('/').pop()?.split('.')[0] || '';
    return {
        path,
        name: fileName
    };
}
export const getImageExtension = (fileName: string): string => {
    return fileName.split('.').pop() || '';
}

export const isValidImageExtension = (extension: string): boolean => {
    return ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff'].includes(extension.toLowerCase());
}

export  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };