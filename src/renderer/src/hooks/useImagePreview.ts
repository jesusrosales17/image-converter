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
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await imagePreview(imageToShow);
        setPreviewData(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar la imagen';
        setError(errorMessage);
        console.error('Error loading image preview:', err);
      } finally {
        setIsLoading(false);
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
