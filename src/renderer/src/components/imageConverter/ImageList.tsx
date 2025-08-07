import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { ImageIcon } from "lucide-react";
import { useImageStore } from "@/store/useImageStore";
import { ImageTableRow } from "./ImageTableRow";

export const ImageList = () => {
  const { images, removeImage, clearImages } = useImageStore();

  return (
    <Card className="flex-1 flex flex-col min-h-0 gap-2 py-0 pt-3 pb-0" >
      <CardHeader className="pb-0 gap-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Archivos ({images.length})
          </CardTitle>
          {images.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearImages}
              className="text-xs"
            >
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-full">
          {images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No hay imágenes seleccionadas</p>
            </div>
          ) : (
            <table className="shadow w-[97%] mx-auto">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Tamaño
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {images.map((file) => (
                  <ImageTableRow
                    key={file.path}
                    file={file}
                    onRemove={() => removeImage(file.path)}
                  />
                ))}
              </tbody>
            </table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
