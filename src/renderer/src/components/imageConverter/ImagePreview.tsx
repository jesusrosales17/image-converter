import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Eye, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import { formatFileSize } from "@/utils/image";
import type { ImageFile } from "@/interfaces/images";


interface ImagePreviewProps {
  file: ImageFile;
}

export const ImagePreview = ({ file }: ImagePreviewProps) => {
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Previsualización - {file.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Original</Label>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border">
              <img
                src={file.preview || "/placeholder.svg"}
                alt={file.name}
                className="max-w-full max-h-full object-contain rounded"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Formato: {file.type}</p>
              <p>Tamaño: {formatFileSize(file.size || 0)}</p>
              <p>Ruta: {file.path}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Vista previa (PNG)</Label>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border">
              <img
                src={file.preview || "/placeholder.svg"}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Formato: PNG</p>
              <p>Calidad: 80%</p>
              <p>Tamaño estimado: {formatFileSize((file.size || 0) * 0.8)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
