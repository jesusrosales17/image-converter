import { useImageStore } from "@/store/useImageStore";
import { isValidImageExtension } from "@/utils/image";
import { toast } from "sonner";

export const useConverter = () => {
    const { outputFormat, quality, outputFolder, images, setImages } = useImageStore();

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
        // validadiones
        if (!outputFormat.trim() || !isValidImageExtension(outputFormat) || quality < 1 || quality > 100 ) {
            toast.error("Configuración de conversión inválida", {
                description: "Por favor, revisa el formato de salida y la calidad.",

            });
            return;
        }

        try {
            const result = await window.electron.ipcRenderer.invoke('convert:images', {
                images,
                outputFormat,
                quality,
                outputFolder
            });

            if (result.success) {
                toast.success("Conversión completada", {
                    description: `Se han convertido ${result.convertedCount} imágenes.`,
                });

                // actualizar el estado de las imágenes convertidas
                const updatedImages = images.map(image => ({
                    ...image,
                    status: 'completed',
                    outputPath: `${outputFolder}/${image.name.split('.').slice(0, -1).join('.')}.${outputFormat}`
                }));
                console.log(updatedImages)
                setImages(updatedImages);
            } else {
                toast.error("Error en la conversión", {
                    description: result.error || "Ocurrió un error al convertir las imágenes.",
                });
            }
        }  catch (error) {
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
