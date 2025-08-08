import { useImageStore } from "@/store/useImageStore";
import { isValidImageExtension } from "@/utils/image";
import { toast } from "sonner";

export const useConverter = () => {
    const { outputFormat, quality, outputFolder, images, isFolderConversion, sourceFolderPath } = useImageStore();

    const startConversion = async () => {
        if(!images || images.length === 0) {
            toast.error("No hay imágenes seleccionadas", {
                description: "Por favor, selecciona al menos una imagen para convertir.",
            });
            return;
        }
        
        if(!outputFolder.trim()) {
            toast.error("Carpeta de salida no especificada", {
                description: "Por favor, selecciona una carpeta de salida para guardar las imágenes convertidas.",
            });
            return;
        }
        
        if (!outputFormat.trim() || !isValidImageExtension(outputFormat) || quality < 1 || quality > 100 ) {
            toast.error("Configuración de conversión inválida", {
                description: "Por favor, revisa el formato de salida y la calidad.",
            });
            return;
        }

        try {
            // 🔄 Los eventos se manejan automáticamente en useConversionEvents
            const result = await window.electron.ipcRenderer.invoke('convert:images', {
                images,
                outputFormat,
                quality,
                outputFolder,
                isFolderConversion,   
                folderPath: sourceFolderPath  
            });

            // Ya no necesitas actualizar manualmente aquí
            // Los eventos lo hacen en tiempo real

        } catch (error) {
            console.log(error);
            toast.error("Error durante la conversión", {
                description: error instanceof Error ? error.message : "Ocurrió un error desconocido.",
            });
        }
    }


    return {
        startConversion
    }
}
