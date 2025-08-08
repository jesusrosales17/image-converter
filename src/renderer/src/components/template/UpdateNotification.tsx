import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

const { ipcRenderer } = window.require ? window.require("electron") : {};

export const UpdateNotification: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    if (!ipcRenderer) return;

    ipcRenderer.on("update:available", (_event: any, info: any) => {
      setUpdateAvailable(true);
      setVersion(info?.version || null);
    });

    ipcRenderer.on("update:downloaded", (_event: any, info: any) => {
      setUpdateDownloaded(true);
      setVersion(info?.version || null);
    });

    return () => {
      ipcRenderer.removeAllListeners("update:available");
      ipcRenderer.removeAllListeners("update:downloaded");
    };
  }, []);

  if (!updateAvailable && !updateDownloaded) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-popover text-popover-foreground border border-border shadow-lg rounded-xl px-6 py-5 flex flex-col items-start gap-2 animate-in fade-in">
      {updateDownloaded ? (
        <>
          <span className="font-semibold text-lg">
            ¡Actualización descargada!
          </span>
          {version && <span className="text-sm">Versión: {version}</span>}
          <Button
            variant="default"
            size="sm"
            className="mt-2"
            onClick={() => ipcRenderer.send("update:install")}
          >
            Reiniciar y actualizar
          </Button>
        </>
      ) : (
        <>
          <span className="font-semibold text-lg">
            ¡Nueva versión disponible!
          </span>
          {version && <span className="text-sm">Versión: {version}</span>}
          <span className="text-xs text-muted-foreground">
            Descargando actualización...
          </span>
        </>
      )}
    </div>
  );
};
