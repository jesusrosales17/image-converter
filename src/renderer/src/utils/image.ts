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
    return ['jpg', 'jpeg', 'png', 'webp', 'avif', 'bmp', 'tiff'].includes(extension.toLowerCase());
}