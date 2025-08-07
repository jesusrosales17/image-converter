import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { X } from "lucide-react";
import { ImagePreview } from "./ImagePreview";
import type { ImageFile } from "@/interfaces/images";
import { formatFileSize } from "@/utils/image";

interface ImageTableRowProps {
  file: ImageFile;
  onRemove: () => void;
}

export const ImageTableRow = ({ file, onRemove }: ImageTableRowProps) => {
  

  const getStatusBadge = (status: ImageFile['status']) => {
    const statusConfig = {
      pending: { variant: "outline" as const, text: "Pendiente" },
      processing: { variant: "secondary" as const, text: "Procesando" },
      completed: { variant: "default" as const, text: "Completado" },
      error: { variant: "destructive" as const, text: "Error" }
    } as const;

    const defaultStatus = 'pending';
    const currentStatus = status || defaultStatus;
    const config = statusConfig[currentStatus as keyof typeof statusConfig];
    
    return (
      <div className="space-y-1">
        <Badge variant={config.variant} className="text-xs">
          {config.text}
        </Badge>
        {status === "processing" && (
          <Progress value={file.progress || 0} className="h-1 w-full" />
        )}
      </div>
    );
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3 font-medium">
        <div className="flex items-center gap-2">
          <img
            src={file.preview || "/placeholder.svg"}
            alt={file.name}
            className="w-8 h-8 object-cover rounded border"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
          <span className="truncate max-w-[200px]">{file.name}</span>
        </div>
      </td>
      <td className="px-4 py-3">{formatFileSize(file.size || 0)}</td>
      <td className="px-4 py-3">{getStatusBadge(file.status)}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center gap-1 justify-end">
          <ImagePreview file={file} />
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};
