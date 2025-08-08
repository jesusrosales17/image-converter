import { useImageStore } from "@/store/useImageStore";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

// ✅ Variable global para evitar múltiples listeners en StrictMode
let globalListenersRegistered = false;
let globalToastShown = false;

export const useConversionEvents = () => {
    const { updateImageStatus, setImages } = useImageStore();
    const isListenerRegistered = useRef(false);
    const toastShownRef = useRef(false);

    useEffect(() => {
        if (isListenerRegistered.current || globalListenersRegistered) {
            return;
        }

        const handleConversionStarted = (data: { total: number }) => {
            console.log(`Iniciando conversión de ${data.total} imágenes`);
            toastShownRef.current = false; 
            globalToastShown = false; 
            
            // Obtener imágenes actuales del store directamente
            const currentImages = useImageStore.getState().images;
            const updatedImages = currentImages.map(img => ({
                ...img,
                status: 'processing' as const,
                progress: 0
            }));
            setImages(updatedImages);
        };

        const handleImageStarted = (data: { 
            imagePath: string; 
            currentIndex: number; 
            total: number; 
        }) => {
            console.log(`Procesando imagen ${data.currentIndex}/${data.total}: ${data.imagePath}`);
            updateImageStatus(data.imagePath, 'processing', 50);
        };

        // 🔄 Evento: Imagen completada
        const handleImageCompleted = (data: {
            imagePath: string;
            outputPath: string;
            success: boolean;
            currentIndex: number;
            total: number;
        }) => {
            updateImageStatus(data.imagePath, 'completed', 100);
            
        };

        const handleImageError = (data: {
            imagePath: string;
            error: string;
            currentIndex: number;
            total: number;
        }) => {
            updateImageStatus(data.imagePath, 'error', 0);
            
            toast.error(`Error en imagen ${data.currentIndex}/${data.total}`, {
                description: data.error,
                duration: 3000
            });
        };

        const handleConversionFinished = (data: {
            convertedCount: number;
            failedCount: number;
            total: number;
        }) => {
            
            if (toastShownRef.current || globalToastShown) {
                return;
            }
            
            toastShownRef.current = true;
            globalToastShown = true;
            
            if (data.failedCount === 0) {
                toast.success("¡Conversión completada!", {
                    description: `${data.convertedCount} imágenes convertidas exitosamente.`,
                    duration: 5000
                });
            } else {
                toast.warning("Conversión completada con errores", {
                    description: `${data.convertedCount} exitosas, ${data.failedCount} con errores.`,
                    duration: 5000
                });
            }
        };

        window.electron.ipcRenderer.on('conversion:started', handleConversionStarted);
        window.electron.ipcRenderer.on('conversion:imageStarted', handleImageStarted);
        window.electron.ipcRenderer.on('conversion:imageCompleted', handleImageCompleted);
        window.electron.ipcRenderer.on('conversion:imageError', handleImageError);
        window.electron.ipcRenderer.on('conversion:finished', handleConversionFinished);

        isListenerRegistered.current = true;
        globalListenersRegistered = true;

        return () => {
            window.electron.ipcRenderer.off('conversion:started', handleConversionStarted);
            window.electron.ipcRenderer.off('conversion:imageStarted', handleImageStarted);
            window.electron.ipcRenderer.off('conversion:imageCompleted', handleImageCompleted);
            window.electron.ipcRenderer.off('conversion:imageError', handleImageError);
            window.electron.ipcRenderer.off('conversion:finished', handleConversionFinished);
            
            isListenerRegistered.current = false;
            toastShownRef.current = false;
            globalListenersRegistered = false;
            globalToastShown = false;
        };
    }, []); 
};
