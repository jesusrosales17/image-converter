// Tipos compartidos entre main y renderer processes

export interface ImageFile {
  path: string;
  name: string;
  size?: number;
  type?: string;
  preview?: string;
  status?: StatusImage;
  progress?: number; // porcentaje de progreso
}

export const StatusImage = {
  pending: "pending",
  processing: "processing", 
  completed: "completed",
  error: "error"
} as const;

export type StatusImage = typeof StatusImage[keyof typeof StatusImage];

export interface DialogResult {
  canceled: boolean;
  files: ImageFile[];
  folderPath?: string;        
  isFolderSelection?: boolean; 
}

export interface ImagePreviewResult {
  preview: string;
  error?: string;
  name: string;
}

export interface UseFileDialogOptions {
  onFilesSelected?: (filePaths: string[]) => void;
}
