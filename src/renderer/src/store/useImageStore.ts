import type { ImageFile, ImageStore, OutputFormal } from '@/interfaces/images';
import { create } from 'zustand';


export const useImageStore = create<ImageStore>((set) => ({
    images: [],
    outputFormat: 'webp',
    isConverting: false,
    quality: 80,
    outputFolder: '',
    imageToShow: '',
    setImageToShow: (image) => set({ imageToShow: image }),
    setImages: (images: ImageFile[]) => set({ images }),
    setIsConverting: (isConverting: boolean) => set({ isConverting }),
    setQuality: (quality: number) => set({ quality }),
    setOutputFolder: (folder: string) => set({ outputFolder: folder }),
    setOutputFormat: (format: OutputFormal) => set({ outputFormat: format }),

    addImage: (image) => set((state) => ({ 
        // evitamos duplicados
        images: state.images.some(img => img.path === image.path) ? state.images : [...state.images, image]
        
    })),
    removeImage: (path) => set((state) => ({ images: state.images.filter((img) => img.path !== path) })),
    clearImages: () => set({ images: [] }),

    imagePreview: async (filePath: string) => {
        try {
            const response = await window.electron.ipcRenderer.invoke('imagePreview:get', filePath);
            return { preview: response.preview, name: response.name };
        } catch (error) {
            console.error('Error al obtener la vista previa de la imagen:', error);
            return { preview: '', error: 'No se pudo obtener la vista previa', name: '' };
        }
    },
}));
