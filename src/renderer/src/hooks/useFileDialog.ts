import { EXTENSIONS } from '@/consts/images';
import type { DialogResult } from '@/interfaces/fileDialog';
import { useImageStore } from '@/store/useImageStore';
import { useCallback } from 'react';



export const useFileDialog = () => {
  const { addImage, setOutputFolder, clearImages, setIsFolderConversion, setSourceFolderPath } = useImageStore();

  const openSingleFileDialog = useCallback(async () => {
    try {
      const result: DialogResult = await window.electron.ipcRenderer.invoke('dialog:open', {
        properties: ['openFile'],
        filters: [
          { name: 'Images', extensions: EXTENSIONS }
        ]
      });
      if (result && !result.canceled && result.files.length > 0) {
        const currentState = useImageStore.getState();
        if (currentState.isFolderConversion) {
          clearImages(); // Limpiar imágenes antes de agregar nuevas
          setIsFolderConversion(false);
          setSourceFolderPath(''); // Limpiar ruta de carpeta fuente
        }
        result.files.forEach(file => {
          addImage(file);
        });
      }
      return [];
    } catch (error) {
      console.error('Error opening single file dialog:', error);
      return [];
    }
  }, [addImage, clearImages, setIsFolderConversion, setSourceFolderPath]); //   Dependencias correctas

  const openMultipleFilesDialog = useCallback(async () => {
    try {
      const result: DialogResult = await window.electron.ipcRenderer.invoke('dialog:open', {
        properties: ['openFile', 'multiSelections'],
        filters: [
          { name: 'Images', extensions: EXTENSIONS }
        ]
      });

      if (result && !result.canceled && result.files.length > 0) {
        const currentState = useImageStore.getState();

        if (currentState.isFolderConversion) {
          clearImages(); // Limpiar imágenes antes de agregar nuevas
          setIsFolderConversion(false);
          setSourceFolderPath(''); // Limpiar ruta de carpeta fuente
        }

        result.files.forEach(file => {
          addImage(file);
        });

        return result.files;
      }

      return [];
    } catch (error) {
      console.error('Error opening multiple files dialog:', error);
      return [];
    }
  }, [addImage, clearImages, setIsFolderConversion, setSourceFolderPath]);

  const openFolderDialog = useCallback(async () => {
    try {
      const result: DialogResult = await window.electron.ipcRenderer.invoke('dialog:open', {
        properties: ['openDirectory']
      });

      if (result && !result.canceled && result.files.length > 0) {
        clearImages(); // Limpiar imágenes antes de agregar nuevas

        setIsFolderConversion(true);
        if (result.folderPath) {
          setSourceFolderPath(result.folderPath);
        }

        result.files.forEach(image => {
          addImage(image);
        });

        return result.files;
      }

      return [];
    } catch (error) {
      console.error('Error opening folder dialog:', error);
      return [];
    }
  }, [clearImages, addImage, setIsFolderConversion, setSourceFolderPath]);

  // abrir dialogo de folder pero para optener ruta de salida
  const openFolderDialogForOutput = useCallback(async () => {
    try {
      const result: string = await window.electron.ipcRenderer.invoke('dialog:openFolderForOutput', {
        properties: ['openDirectory']
      });

      if (result) {
        // Aquí puedes manejar la carpeta seleccionada para la salida
        setOutputFolder(result);
        return result;
      }

      return '';
    } catch (error) {
      console.error('Error opening folder dialog for output:', error);
      return '';
    }
  }, [setOutputFolder]);

  return {
    openSingleFileDialog,
    openMultipleFilesDialog,
    openFolderDialog,
    openFolderDialogForOutput
  };
};
