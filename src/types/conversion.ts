import { ImageFile } from "../renderer/src/interfaces/images";

export interface ConversionOptions {
    inputFormat: string;
    outputFormat: string;
    quality: number;
    outputFolder: string;
    images: ImageFile[];
}
export interface ConversionResult {
  success: boolean;
  convertedCount: number;
  failedCount: number;
  error?: string;
  details: Array<{
    originalPath: string;
    outputPath?: string;
    success: boolean;
    error?: string;
  }>;
}