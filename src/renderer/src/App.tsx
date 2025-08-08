import { Header } from "./components/template/Header";
import { ImageTable } from "./components/imageConverter/ImageTable";
import { ImageSettings } from "./components/imageConverter/ImageSettings";
import { InputImageUpload } from "./components/imageConverter/InputImageUpload";
import { Toaster } from "sonner";
import { useConversionEvents } from "./hooks/useConversionEvents";


export default function App() {
  useConversionEvents();
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
        </div>

        <ImageSettings />
        <Toaster />
      </div>
    </div>
  );
}
