import  {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Progress } from "../ui/progress";
import  { ScrollArea } from "../ui/scroll-area";
import  { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {  Eye, ImageIcon, X } from "lucide-react";
import  { Button } from "../ui/button";
import  { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useState } from "react";
import { useImageStore } from "@/store/useImageStore";

interface ImageFile {
  id: string
  name: string
  size: number
  type: string
  path: string
  preview?: string
  status: "pending" | "processing" | "completed" | "error"
  progress: number
}

export const ImageList = () => {
  const {images } = useImageStore();
  const [previewImage, setPreviewImage] = useState<ImageFile | null>(null)
  

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }




  return (
    <Card className="flex-1 flex flex-col min-h-0">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Archivos 
          </CardTitle>
          {/* {selectedFiles.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFiles}
              className="text-xs"
            >
              Limpiar
            </Button> */}
          {/* )} */}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-full px-4 pb-4">
          <div className="space-y-2">
            {images.map((file) => (
              <div
                key={file.path}
                className="flex items-center gap-3 p-2 bg-white rounded border hover:bg-gray-50"
              >
                {/* {getStatusIcon(file.status)} */}
                <div className="flex-1 min-w-0">
                  <img
                    src={file.preview || "/placeholder.svg"}
                    alt={file.name}
                    className="w-4 h-4 object-contain rounded"
                  />
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2">
                   
                    <Badge
                      variant={
                        file.status === "completed"
                          ? "default"
                          : file.status === "processing"
                          ? "secondary"
                          : file.status === "error"
                          ? "destructive"
                          : "outline"
                      }
                      className="text-xs px-1 py-0"
                    >
                      {file.status === "pending"
                        ? "Pendiente"
                        : file.status === "processing"
                        ? "Procesando"
                        : file.status === "completed"
                        ? "Listo"
                        : "Error"}
                    </Badge>
                  </div>
                  {file.status === "processing" && (
                    <Progress value={file.progress} className="mt-1 h-1" />
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        // onClick={() => setPreviewImage(file.preview || )}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-3 w-3" />
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
                          <Label className="text-sm font-medium">
                            Original
                          </Label>
                          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border">
                            <img
                              src={file.preview || "/placeholder.svg"}
                              alt={file.name}
                              className="max-w-full max-h-full object-contain rounded"
                            />
                          </div>
                          <div className="text-xs text-gray-500 space-y-1">
                            <p>Formato: {file.type}</p>
                            <p>Tamaño: {formatFileSize(file.size || 0)}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Vista previa png
                            {/* Vista previa ({outputFormat.toUpperCase()}) */}
                          </Label>
                          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border">
                            <img
                              src={file.preview || "/placeholder.svg"}
                              alt="Preview"
                              className="max-w-full max-h-full object-contain rounded"
                            />
                          </div>
                          <div className="text-xs text-gray-500 space-y-1">
                            <p>Formato: png</p>
                            <p>Calidad: 80%</p>
                            <p>
                              Tamaño estimado:{" "}
                              {formatFileSize(file.size || 0 * (80 / 100))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="sm"
                    // onClick={() => removeFile(file.id)}
                    // disabled={isProcessing}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
