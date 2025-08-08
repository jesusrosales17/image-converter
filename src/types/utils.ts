// Utilidades compartidas entre main y renderer

export const getImageExtension = (fileName: string): string => {
  return fileName.split('.').pop() || '';
}

export const isValidImageExtension = (extension: string): boolean => {
  return ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff'].includes(extension.toLowerCase());
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
