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
        // ✅ Evitar múltiples registros a nivel global y local
        if (isListenerRegistered.current || globalListenersRegistered) {
            console.log("🚫 Listeners ya registrados, evitando duplicado");
            return;
        }

        // 🔄 Evento: Conversión iniciada
        const handleConversionStarted = (data: { total: number }) => {
            console.log(`Iniciando conversión de ${data.total} imágenes`);
            toastShownRef.current = false; // ✅ Resetear flag al iniciar nueva conversión
            globalToastShown = false; // ✅ Resetear flag global
            
            // Obtener imágenes actuales del store directamente
            const currentImages = useImageStore.getState().images;
            const updatedImages = currentImages.map(img => ({
                ...img,
                status: 'processing' as const,
                progress: 0
            }));
            setImages(updatedImages);
        };

        // 🔄 Evento: Imagen iniciada
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
            console.log(`✅ Completada ${data.currentIndex}/${data.total}: ${data.imagePath}`);
            updateImageStatus(data.imagePath, 'completed', 100);
            
            // // ✅ Solo toast individual, NO el de "conversión completada"
            // toast.success(`Imagen ${data.currentIndex}/${data.total} convertida`, {
            //     description: `${data.imagePath.split('/').pop()}`,
            //     duration: 1500 // Reducir duración para evitar spam
            // });
        };

        // 🔄 Evento: Error en imagen
        const handleImageError = (data: {
            imagePath: string;
            error: string;
            currentIndex: number;
            total: number;
        }) => {
            console.error(`❌ Error ${data.currentIndex}/${data.total}: ${data.imagePath}`, data.error);
            updateImageStatus(data.imagePath, 'error', 0);
            
            toast.error(`Error en imagen ${data.currentIndex}/${data.total}`, {
                description: data.error,
                duration: 3000
            });
        };

        // 🔄 Evento: Conversión finalizada
        const handleConversionFinished = (data: {
            convertedCount: number;
            failedCount: number;
            total: number;
        }) => {
            console.log(`🏁 Conversión finalizada recibida: ${data.convertedCount} exitosas, ${data.failedCount} fallidas`);
            console.log(`🔍 Estado del toast: local=${toastShownRef.current}, global=${globalToastShown}`);
            
            // ✅ Solo UNA notificación final usando flag global y local
            if (toastShownRef.current || globalToastShown) {
                console.log("🚫 Toast ya mostrado, evitando duplicado");
                return;
            }
            
            console.log("✅ Mostrando toast de finalización");
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

        // 📡 Registrar eventos UNA SOLA VEZ
        console.log("📡 Registrando listeners de conversión...");
        window.electron.ipcRenderer.on('conversion:started', handleConversionStarted);
        window.electron.ipcRenderer.on('conversion:imageStarted', handleImageStarted);
        window.electron.ipcRenderer.on('conversion:imageCompleted', handleImageCompleted);
        window.electron.ipcRenderer.on('conversion:imageError', handleImageError);
        window.electron.ipcRenderer.on('conversion:finished', handleConversionFinished);

        isListenerRegistered.current = true;
        globalListenersRegistered = true;
        console.log("✅ Listeners registrados correctamente");

        // 🧹 Cleanup
        return () => {
            console.log("🧹 Limpiando listeners de conversión...");
            window.electron.ipcRenderer.off('conversion:started', handleConversionStarted);
            window.electron.ipcRenderer.off('conversion:imageStarted', handleImageStarted);
            window.electron.ipcRenderer.off('conversion:imageCompleted', handleImageCompleted);
            window.electron.ipcRenderer.off('conversion:imageError', handleImageError);
            window.electron.ipcRenderer.off('conversion:finished', handleConversionFinished);
            
            isListenerRegistered.current = false;
            toastShownRef.current = false;
            globalListenersRegistered = false;
            globalToastShown = false;
            console.log("✅ Listeners limpiados correctamente");
        };
    }, []); // ✅ Sin dependencias para evitar re-registros
};
