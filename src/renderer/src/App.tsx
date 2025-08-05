
"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FolderOpen, ImageIcon, Settings, Play, X, Check, AlertCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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

export default function App() {
  const [selectedFiles, setSelectedFiles] = useState<ImageFile[]>([])
  const [outputFormat, setOutputFormat] = useState("webp")
  const [quality, setQuality] = useState([80])
  const [outputFolder, setOutputFolder] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [previewImage, setPreviewImage] = useState<ImageFile | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    const newFiles: ImageFile[] = imageFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      path: file.name,
      status: "pending",
      progress: 0,
      preview: `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(file.name)}`,
    }))

    setSelectedFiles((prev) => [...prev, ...newFiles])
  }, [])

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const clearAllFiles = () => {
    setSelectedFiles([])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const startConversion = async () => {
    setIsProcessing(true)
    setOverallProgress(0)

    // Simular proceso de conversión
    for (let i = 0; i < selectedFiles.length; i++) {
      setSelectedFiles((prev) => prev.map((file, index) => (index === i ? { ...file, status: "processing" } : file)))

      // Simular progreso de archivo individual
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        setSelectedFiles((prev) => prev.map((file, index) => (index === i ? { ...file, progress } : file)))
      }

      setSelectedFiles((prev) =>
        prev.map((file, index) => (index === i ? { ...file, status: "completed", progress: 100 } : file)),
      )

      setOverallProgress(((i + 1) / selectedFiles.length) * 100)
    }

    setIsProcessing(false)
  }

  const getStatusIcon = (status: ImageFile["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />
      case "processing":
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <ImageIcon className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header compacto */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Conversor de Imágenes</h1>
          <p className="text-sm text-gray-500">Convierte y optimiza tus imágenes</p>
        </div>
        {/* <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Configuración
          </Button>
        </div> */}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Panel Principal */}
        <div className="flex-1 flex flex-col p-4 gap-4">
          {/* Área de Carga Compacta */}
          <Card className="flex-shrink-0">
            <CardContent className="p-4">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="font-medium text-gray-700 mb-2">Arrastra imágenes aquí</p>

                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    Imagen
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    <Upload className="h-3 w-3 mr-1" />
                    Múltiples
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    <FolderOpen className="h-3 w-3 mr-1" />
                    Carpeta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Archivos */}
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Archivos ({selectedFiles.length})</CardTitle>
                {selectedFiles.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFiles} className="text-xs">
                    Limpiar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 min-h-0">
              <ScrollArea className="h-full px-4 pb-4">
                <div className="space-y-2">
                  {selectedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-3 p-2 bg-white rounded border hover:bg-gray-50">
                      {getStatusIcon(file.status)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{file.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
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
                        {file.status === "processing" && <Progress value={file.progress} className="mt-1 h-1" />}
                      </div>

                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setPreviewImage(file)}
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
                                <Label className="text-sm font-medium">Original</Label>
                                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border">
                                  <img
                                    src={file.preview || "/placeholder.svg"}
                                    alt={file.name}
                                    className="max-w-full max-h-full object-contain rounded"
                                  />
                                </div>
                                <div className="text-xs text-gray-500 space-y-1">
                                  <p>Formato: {file.type}</p>
                                  <p>Tamaño: {formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                  Vista previa ({outputFormat.toUpperCase()})
                                </Label>
                                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border">
                                  <img
                                    src={`/vista-previa-text.png?height=300&width=300&text=Vista previa ${outputFormat.toUpperCase()}`}
                                    alt="Preview"
                                    className="max-w-full max-h-full object-contain rounded"
                                  />
                                </div>
                                <div className="text-xs text-gray-500 space-y-1">
                                  <p>Formato: {outputFormat.toUpperCase()}</p>
                                  <p>Calidad: {quality[0]}%</p>
                                  <p>Tamaño estimado: {formatFileSize(file.size * (quality[0] / 100))}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          disabled={isProcessing}
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

          {/* Progreso General */}
          {isProcessing && (
            <Card className="flex-shrink-0">
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso general</span>
                    <span>{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panel de Configuración Lateral */}
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
              <Slider value={quality} onValueChange={setQuality} max={100} min={1} step={1} className="w-full" />
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
                <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Botón de Conversión */}
            <Button className="w-full" onClick={startConversion} disabled={selectedFiles.length === 0 || isProcessing}>
              <Play className="h-4 w-4 mr-2" />
              {isProcessing ? "Procesando..." : "Iniciar Conversión"}
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
      </div>
    </div>
  )
}
