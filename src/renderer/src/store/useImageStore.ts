import type { ImageFile, ImageStore, OutputFormal } from '@/interfaces/images';
import { create } from 'zustand';


export const useImageStore = create<ImageStore>((set) => ({
    images: [],
    outputFormat: 'webp',
    isConverting: false,
    quality: 80,
    outputFolder: '',

    setImages: (images: ImageFile[]) => set({ images }),
    setIsConverting: (isConverting: boolean) => set({ isConverting }),
    setQuality: (quality: number) => set({ quality }),
    setOutputFolder: (folder: string) => set({ outputFolder: folder }),
    setOutputFormat: (format: OutputFormal) => set({ outputFormat: format }),

    addImage: (image) => set((state) => ({ images: [...state.images, image] })),
    removeImage: (path) => set((state) => ({ images: state.images.filter((img) => img.path !== path) })),
    clearImages: () => set({ images: [] }),
}));
