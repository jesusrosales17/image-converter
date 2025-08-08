
"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Info } from "lucide-react";
import { InfoModal } from "./InfoModal";

export const Header = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div>
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Conversor de Imágenes
          </h1>
          <p className="text-sm text-gray-500">
            Convierte y optimiza tus imágenes fácilmente
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowInfo(true)}
            className="flex items-center gap-2"
          >
            <Info className="h-4 w-4" />
            Ayuda
          </Button>
        </div>
      </div>
      
      <InfoModal 
        isOpen={showInfo} 
        onClose={() => setShowInfo(false)} 
      />
    </div>
  );
};
