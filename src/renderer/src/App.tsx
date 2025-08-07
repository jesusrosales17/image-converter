
"use client"


import {  useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Header } from "./components/template/Header"
import { ImageTable } from "./components/imageConverter/ImageTable"
import { ImageSettings } from "./components/imageConverter/ImageSettings"
import { InputImageUpload } from "./components/imageConverter/InputImageUpload"
import { useImageStore } from "./store/useImageStore"
import { Toaster } from "sonner"

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
  const {images} = useImageStore();
  const [isProcessing, setIsProcessing] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
   return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header compacto */}
     <Header /> 

      <div className="flex-1 flex overflow-hidden">
        {/* Panel Principal */}
        <div className="flex-1 flex flex-col p-4 gap-4">
          {/* Área de Carga Compacta */}
          <InputImageUpload />

       
          <ImageTable />
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

       


        <ImageSettings />
        <Toaster  />
      </div>
    </div>
  )
}
