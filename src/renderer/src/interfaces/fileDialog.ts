export interface DialogResult {
  canceled: boolean;
  filePaths: string[];
}

export interface UseFileDialogOptions {
  onFilesSelected?: (filePaths: string[]) => void;
}

