import { Button } from '../ui/button'
import { Play } from 'lucide-react'
import { useConverter } from '@/hooks/useConverter'

export const ButtonStartConversion = () => {
    
    const {startConversion} = useConverter();
  return (

     <Button
          className="w-full"
          onClick={startConversion}
        //   disabled={selectedFiles.length === 0 || isProcessing}
        >
          <Play className="h-4 w-4 mr-2" />
          {/* {isProcessing ? "Procesando..." : "Iniciar Conversión"} */}
          Iniciar conversión
        </Button>
  )
}
