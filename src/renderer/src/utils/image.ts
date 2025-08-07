import type { ImageFile } from "@/interfaces/images";

export const formatImageInfo = (path: string): ImageFile => {
    const fileName = path.split('/').pop() || '';
    return {
        path,
        name: fileName
    };
}