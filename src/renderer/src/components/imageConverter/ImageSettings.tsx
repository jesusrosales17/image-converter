import { Slider } from "@radix-ui/react-slider";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { AlertCircle, FolderOpen, Play } from "lucide-react";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { useState } from "react";

export const ImageSettings = () => {
 const [outputFormat, setOutputFormat] = useState("webp")
  const [quality, setQuality] = useState([80])
  const [outputFolder, setOutputFolder] = useState("")
  return (

    <div className="w-80 bg-white border-l p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Configuración</h3>

        {/* Formato de Salida */}
        <div className="space-y-2 mb-4">
          <Label className="text-sm">Formato de salida</Label>
          <Select value={outputFormat} onValueChange={setOutputFormat}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="webp">WebP</SelectItem>
              <SelectItem value="jpg">JPEG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="avif">AVIF</SelectItem>
              <SelectItem value="bmp">BMP</SelectItem>
              <SelectItem value="tiff">TIFF</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calidad */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <Label className="text-sm">Calidad</Label>
            <span className="text-sm text-gray-500">{quality[0]}%</span>
          </div>
          <Slider
            value={quality}
            onValueChange={setQuality}
            max={100}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Menor tamaño</span>
            <span>Mayor calidad</span>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Carpeta de Destino */}
        <div className="space-y-2 mb-4">
          <Label className="text-sm">Carpeta de destino</Label>
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 bg-gray-50 border rounded text-sm text-gray-600 truncate min-w-0">
              {outputFolder || "Seleccionar..."}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0 bg-transparent"
            >
              <FolderOpen className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Botón de Conversión */}
        <Button
          className="w-full"
        //   onClick={startConversion}
        //   disabled={selectedFiles.length === 0 || isProcessing}
        >
          <Play className="h-4 w-4 mr-2" />
          {/* {isProcessing ? "Procesando..." : "Iniciar Conversión"} */}
          Iniciar conversión
        </Button>

        {/* Información */}
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Los archivos se guardarán en la carpeta seleccionada.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};
