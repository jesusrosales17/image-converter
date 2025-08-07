"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Eye, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useImageStore } from "@/store/useImageStore";
import { useEffect, useState } from "react";
import type { ImagePreviewResult } from "@/interfaces/fileDialog";

export const ImagePreview = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<ImagePreviewResult | null>(null);
  // obtener el path de la imagen y solicitarla a electron para obtener la vista previa
  const {imagePreview, imageToShow, setImageToShow } = useImageStore();
  // Si no hay imagen seleccionada, no mostrar el preview


  // Solicitar la vista previa de la imagen a Electron
  useEffect(() => {
    const getImagePreview = async () => {
      setLoading(true);

      const preview = await imagePreview(imageToShow!);
      setPreview(preview);
      setLoading(false);
    };
    getImagePreview();
  }, [imagePreview, imageToShow]);

  return (
    <Dialog open={!!imageToShow} onOpenChange={() => setImageToShow("")}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {preview?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-1">
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border">
            {loading ? (
              <p>Cargando...</p>
            ) : (
              <img
                src={preview?.preview || "/placeholder.svg"}
                className="max-w-full max-h-full object-contain rounded"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
