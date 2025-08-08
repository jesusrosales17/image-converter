import { useEffect, useState } from 'react';
import { useImageStore } from '@/store/useImageStore';
import type { ImagePreviewResult } from '@/interfaces/fileDialog';

interface UseImagePreviewReturn {
  isLoading: boolean;
  previewData: ImagePreviewResult | null;
  error: string | null;
  selectedImagePath: string;
  closePreview: () => void;
  hasSelectedImage: boolean;
}

export const useImagePreview = (): UseImagePreviewReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<ImagePreviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { imagePreview, imageToShow, setImageToShow } = useImageStore();

  const hasSelectedImage = Boolean(imageToShow);

  const closePreview = () => {
    setImageToShow('');
    setPreviewData(null);
    setError(null);
  };

  useEffect(() => {
    if (!imageToShow) {
      setPreviewData(null);
      setError(null);
      return;
    }

    const loadImagePreview = async () => {
      const maxRetries = 2;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          setIsLoading(true);
          setError(null);
          
          console.log(`🔄 Cargando preview (intento ${attempt}/${maxRetries}):`, imageToShow);
          
          // ✅ Agregar delay entre intentos
          if (attempt > 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          const result = await imagePreview(imageToShow);
          
          // ✅ Validar que el resultado es válido
          if (!result) {
            throw new Error('Preview result is null');
          }
          
          // Si tiene error, usar ese error
          if (result.error) {
            throw new Error(result.error);
          }
          
          // ✅ Validar que el preview no está vacío
          if (!result.preview || result.preview.trim() === '') {
            throw new Error('Preview data is empty');
          }
          
          console.log(`✅ Preview cargado exitosamente (intento ${attempt}):`, result.name);
          setPreviewData(result);
          return; // ✅ Salir del loop si fue exitoso
          
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar la imagen';
          console.warn(`⚠️ Error en intento ${attempt}/${maxRetries}:`, errorMessage);
          
          // Si no es el último intento, continuar
          if (attempt < maxRetries) {
            continue;
          }
          
          // Si es el último intento, mostrar el error
          setError(errorMessage);
          console.error('❌ Error final loading image preview:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadImagePreview();
  }, [imageToShow, imagePreview]);

  return {
    isLoading,
    previewData,
    error,
    selectedImagePath: imageToShow || '',
    closePreview,
    hasSelectedImage
  };
};
