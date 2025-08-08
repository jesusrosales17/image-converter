"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Info, FolderOpen, File, Files, ArrowRight, Trash2, AlertCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal = ({ isOpen, onClose }: InfoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Guía de Usuario - Convertidor de Imágenes
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formatos Soportados */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <File className="h-5 w-5 text-green-500" />
              Formatos Soportados
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-2">Entrada:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">JPG</Badge>
                  <Badge variant="outline">JPEG</Badge>
                  <Badge variant="outline">PNG</Badge>
                  <Badge variant="outline">WEBP</Badge>
                  <Badge variant="outline">AVIF</Badge>
                  <Badge variant="outline">TIFF</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-2">Salida:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">JPG</Badge>
                  <Badge variant="secondary">PNG</Badge>
                  <Badge variant="secondary">WEBP</Badge>
                  <Badge variant="secondary">AVIF</Badge>
                  <Badge variant="secondary">TIFF</Badge>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Modos de Selección */}
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Files className="h-5 w-5 text-blue-500" />
              Modos de Selección de Imágenes
            </h3>

            <div className="space-y-4">
              {/* Archivo Individual */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <File className="h-4 w-4 text-blue-500" />
                  <h4 className="font-medium">Archivo Individual</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Selecciona una sola imagen para convertir.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Resultado:</span>
                  <code className="bg-white px-2 py-1 rounded">imagen.webp</code>
                  <span>→ carpeta de salida</span>
                </div>
              </div>

              {/* Archivos Múltiples */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <Files className="h-4 w-4 text-green-500" />
                  <h4 className="font-medium">Archivos Múltiples</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Selecciona varias imágenes individualmente para convertir.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Resultado:</span>
                  <code className="bg-white px-2 py-1 rounded">imagen1.webp, imagen2.webp...</code>
                  <span>→ carpeta de salida</span>
                </div>
              </div>

              {/* Carpeta Completa */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <FolderOpen className="h-4 w-4 text-purple-500" />
                  <h4 className="font-medium">Carpeta Completa</h4>
                  <Badge variant="outline" className="text-xs">Mantiene estructura</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Selecciona una carpeta y convierte automáticamente todas las imágenes, 
                  incluyendo subcarpetas, manteniendo la estructura original.
                </p>
                
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">
                    <strong>Ejemplo de estructura:</strong>
                  </div>
                  <div className="bg-white p-3 rounded border text-xs font-mono">
                    <div className="text-gray-500">📁 Carpeta seleccionada:</div>
                    <div className="ml-2">
                      <div>Photos/</div>
                      <div className="ml-2">├── vacaciones/</div>
                      <div className="ml-4">│   ├── playa.jpg</div>
                      <div className="ml-4">│   └── montaña.png</div>
                      <div className="ml-2">└── familia/</div>
                      <div className="ml-4">    └── reunion.tiff</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 my-2">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">Se convierte a:</span>
                  </div>
                  
                  <div className="bg-white p-3 rounded border text-xs font-mono">
                    <div className="text-gray-500">📁 Carpeta de salida:</div>
                    <div className="ml-2">
                      <div>Converted/</div>
                      <div className="ml-2">├── vacaciones/</div>
                      <div className="ml-4">│   ├── playa.webp</div>
                      <div className="ml-4">│   └── montaña.webp</div>
                      <div className="ml-2">└── familia/</div>
                      <div className="ml-4">    └── reunion.webp</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Comportamiento de Limpieza */}
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Comportamiento de Limpieza Automática
            </h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-yellow-800">¡Importante!</h4>
                  <p className="text-sm text-yellow-700">
                    Para mantener la coherencia entre modos de selección, la aplicación 
                    limpia automáticamente la lista cuando cambias de modo:
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <div className="bg-red-100 p-1 rounded">
                  <FolderOpen className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-red-800 text-sm">
                    Carpeta → Individual/Múltiple
                  </div>
                  <div className="text-sm text-red-700">
                    Al seleccionar archivos individuales o múltiples después de haber 
                    seleccionado una carpeta, se eliminan todas las imágenes de la carpeta.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-1 rounded">
                  <Files className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-blue-800 text-sm">
                    Individual/Múltiple → Carpeta
                  </div>
                  <div className="text-sm text-blue-700">
                    Al seleccionar una carpeta después de haber agregado archivos individuales, 
                    se eliminan todos los archivos previos.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Configuración y Conversión */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Configuración y Conversión</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Antes de convertir:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Selecciona el formato de salida</li>
                  <li>• Ajusta la calidad (1-100)</li>
                  <li>• Elige la carpeta de destino</li>
                  <li>• Revisa la lista de imágenes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Durante la conversión:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Se muestra el progreso en tiempo real</li>
                  <li>• Estados: Pendiente → Procesando → Completada</li>
                  <li>• Notificaciones por cada imagen</li>
                  <li>• Resumen final de resultados</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          {/* Tips y Recomendaciones */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Tips y Recomendaciones</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="font-medium text-green-600">💡</span>
                <span><strong>WEBP:</strong> Mejor compresión, ideal para web</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-blue-600">💡</span>
                <span><strong>AVIF:</strong> Máxima compresión, soporte moderno</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-purple-600">💡</span>
                <span><strong>PNG:</strong> Sin pérdida, ideal para logos/gráficos</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-orange-600">💡</span>
                <span><strong>Calidad 80-90:</strong> Buen balance tamaño/calidad</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-red-600">⚠️</span>
                <span><strong>Archivos existentes:</strong> Se omiten automáticamente si ya existen</span>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
