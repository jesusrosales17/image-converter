import { Button } from "../ui/button";
import { Play } from "lucide-react";
import { useConverter } from "@/hooks/useConverter";
import { useImageStore } from "@/store/useImageStore";

export const ButtonStartConversion = () => {
  const { startConversion, isConverting } = useConverter();
  const images = useImageStore((state) => state.images);
  return (
    <Button
      className="w-full"
      onClick={startConversion}
      disabled={images.length === 0 || isConverting}
    >
      <Play className="h-4 w-4 mr-2" />
      {isConverting ? "Procesando..." : "Iniciar Conversión"}
    </Button>
  );
};
