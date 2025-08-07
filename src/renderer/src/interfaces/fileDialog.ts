import type { ImageFile } from "./images";

export interface DialogResult {
  canceled: boolean;
  files: ImageFile[];
}

export interface UseFileDialogOptions {
  onFilesSelected?: (filePaths: string[]) => void;
}

