import { useImageStore } from "@/store/useImageStore";
import { isValidImageExtension } from "@/utils/image";
import { useState } from "react";
import { toast } from "sonner";

export const useConverter = () => {
    const { outputFormat, quality, outputFolder, images, isFolderConversion, sourceFolderPath } = useImageStore();
    const [isConverting, setIsConverting] = useState(false);

    const startConversion = async () => {
        if (!images || images.length === 0) {
            toast.error("No hay imágenes seleccionadas", {
                description: "Por favor, selecciona al menos una imagen para convertir.",
            });
            return;
        }

        if (!outputFolder.trim()) {
            toast.error("Carpeta de salida no especificada", {
                description: "Por favor, selecciona una carpeta de salida para guardar las imágenes convertidas.",
            });
            return;
        }

        if (!outputFormat.trim() || !isValidImageExtension(outputFormat) || quality < 1 || quality > 100) {
            toast.error("Configuración de conversión inválida", {
                description: "Por favor, revisa el formato de salida y la calidad.",
            });
            return;
        }

        try {
            setIsConverting(true);
            await window.electron.ipcRenderer.invoke('convert:images', {
                images,
                outputFormat,
                quality,
                outputFolder,
                isFolderConversion,
                folderPath: sourceFolderPath
            });


        } catch (error) {
            console.log(error);
            toast.error("Error durante la conversión", {
                description: error instanceof Error ? error.message : "Ocurrió un error desconocido.",
            });
        } finally {
            setIsConverting(false);
        }
    }


    return {
        startConversion,
        isConverting
    }
}
