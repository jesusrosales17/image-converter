import { FolderOpen, ImageIcon, Upload } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

export const InputImageUpload = () => {
  return (
    <Card className="flex-shrink-0">
      <CardContent className="p-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            false
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="font-medium text-gray-700 mb-2">
            Arrastra imágenes aquí
          </p>

          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-transparent"
            >
              <ImageIcon className="h-3 w-3 mr-1" />
              Imagen
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-transparent"
            >
              <Upload className="h-3 w-3 mr-1" />
              Múltiples
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-transparent"
            >
              <FolderOpen className="h-3 w-3 mr-1" />
              Carpeta
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
