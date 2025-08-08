import type { ImageFile } from "./images";

export interface DialogResult {
  canceled: boolean;
  files: ImageFile[];
  folderPath?: string;        
  isFolderSelection?: boolean; 
}

export interface UseFileDialogOptions {
  onFilesSelected?: (filePaths: string[]) => void;
}

export interface ImagePreviewResult {
  preview: string;
  error?: string;
  name: string;
}