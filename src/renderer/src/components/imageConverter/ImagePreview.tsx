import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Eye, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import type { ImageFile } from "@/interfaces/images";


interface ImagePreviewProps {
  file: ImageFile;
}

export const ImagePreview = ({ file }: ImagePreviewProps) => {
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {file.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-1">
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border">
            <img
              src={file.preview || "/placeholder.svg"}
              alt={file.name}
              className="max-w-full max-h-full object-contain rounded"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>
          
        </div>
      </DialogContent>
    </Dialog>
  );
};
