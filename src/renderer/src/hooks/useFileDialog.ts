import { EXTENSIONS } from '@/consts/images';
import type { DialogResult } from '@/interfaces/fileDialog';
import { useImageStore } from '@/store/useImageStore';
import { formatImageInfo } from '@/utils/image';
import { useCallback } from 'react';



export const useFileDialog = () => {
    const {addImage} = useImageStore();
  const openSingleFileDialog = useCallback(async () => {
    try {
      const result: DialogResult = await window.electron.ipcRenderer.invoke('dialog:open', {
        properties: ['openFile'],
        filters: [
          { name: 'Images', extensions: EXTENSIONS }
        ]
      });
      
      if (result && !result.canceled && result.filePaths.length > 0) {
        result.filePaths.map(file => {
            const image = formatImageInfo(file);
            addImage(image);
        })
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
          { name: 'Images', extensions: EXTENSIONS }
        ]
      });
      
      if (result && !result.canceled && result.filePaths.length > 0) {
        return result.filePaths.map(file => {
            const image = formatImageInfo(file);
            addImage(image);
        });
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
