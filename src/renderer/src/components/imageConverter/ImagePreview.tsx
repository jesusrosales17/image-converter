"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ImageIcon } from "lucide-react";
import { useImagePreview } from "@/hooks/useImagePreview";
import { ImageDisplay } from "../ui/ImageDisplay";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ErrorDisplay } from "../ui/ErrorDisplay";

/**
 * Modal component for displaying image previews
 * Handles loading states, errors, and displays image metadata
 */
export const ImagePreviewModal = () => {
  const { isLoading, previewData, error, closePreview, hasSelectedImage } =
    useImagePreview();

  // Don't render if no image is selected
  if (!hasSelectedImage) {
    return null;
  }

  const renderImageContent = () => {
    console.log('📸 Preview data:', previewData);
    
    if (isLoading) {
      return (
        <LoadingSpinner message="Cargando vista previa..." className="h-64" />
      );
    }

    if (error) {
      return <ErrorDisplay message={error} className="h-64" />;
    }

    if (!previewData) {
      return (
        <ErrorDisplay message="No se pudo cargar la imagen" className="h-64" />
      );
    }

    // ✅ Si tenemos preview, intentar mostrarla
    if (previewData.preview && previewData.preview.trim() !== '') {
      return (
        <ImageDisplay
          src={previewData.preview}
          alt={previewData.name || "Vista previa"}
        />
      );
    }

    // ✅ Solo mostrar error si realmente no hay preview
    return (
      <ErrorDisplay
        message={`Formato ${getFileExtension(previewData.name)} no compatible con vista previa`}
        className="h-64"
      />
    );
  };

  // ✅ Función helper para obtener extensión
  const getFileExtension = (filename: string): string => {
    return filename?.split('.').pop()?.toUpperCase() || 'UNKNOWN';
  };

  return (
    <Dialog open={hasSelectedImage} onOpenChange={closePreview}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {previewData?.name || "Vista previa de imagen"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image container */}
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border">
            {renderImageContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
