import type { DialogResult } from '@/interfaces/fileDialog';
import { useCallback } from 'react';

const extensions = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'bmp', 'tiff'];

export const useFileDialog = () => {
  const openSingleFileDialog = useCallback(async () => {
    try {
      const result: DialogResult = await window.electron.ipcRenderer.invoke('dialog:open', {
        properties: ['openFile'],
        filters: [
          { name: 'Images', extensions }
        ]
      });
      
        console.log('resultado', result) 
      if (result && !result.canceled && result.filePaths.length > 0) {
        return result.filePaths;
      }
      return [];
    } catch (error) {
      console.error('Error opening single file dialog:', error);
      return [];
    }
  }, []);

  const openMultipleFilesDialog = useCallback(async () => {
    try {
      const result: DialogResult = await window.electron.ipcRenderer.invoke('dialog:open', {
        properties: ['openFile', 'multiSelections'],
        filters: [
          { name: 'Images', extensions }
        ]
      });
      
      if (result && !result.canceled && result.filePaths.length > 0) {
        return result.filePaths;
      }
      
      return [];
    } catch (error) {
      console.error('Error opening multiple files dialog:', error);
      return [];
    }
  }, []);

  const openFolderDialog = useCallback(async () => {
    try {
      const result: DialogResult = await window.electron.ipcRenderer.invoke('dialog:open', {
        properties: ['openDirectory']
      });
      
      if (result && !result.canceled && result.filePaths.length > 0) {
        // Para carpetas, necesitarías implementar lógica adicional
        // para escanear los archivos de imagen dentro de la carpeta
        return result.filePaths;
      }
      
      return [];
    } catch (error) {
      console.error('Error opening folder dialog:', error);
      return [];
    }
  }, []);

  return {
    openSingleFileDialog,
    openMultipleFilesDialog,
    openFolderDialog
  };
};
