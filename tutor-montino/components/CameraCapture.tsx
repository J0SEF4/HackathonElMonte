"use client";

import { useState, useRef } from "react";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  disabled?: boolean;
}

export default function CameraCapture({ onCapture, disabled = false }: CameraCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraUrl, setCameraUrl] = useState<string>("http://192.168.255.190/capture");
  const [showConfig, setShowConfig] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const captureFromCamera = async () => {
    if (!cameraUrl.trim()) {
      setCameraError("Por favor ingresa la URL de la cámara IP");
      setShowConfig(true);
      return;
    }

    setIsCapturing(true);
    setCameraError(null);

    try {
      // Crear imagen para cargar desde la cámara IP
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      const loadImage = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("No se pudo conectar con la cámara"));
        
        // Agregar timestamp para evitar caché
        const timestamp = Date.now();
        const separator = cameraUrl.includes('?') ? '&' : '?';
        img.src = `${cameraUrl}${separator}t=${timestamp}`;
      });

      await loadImage;

      // Crear canvas y capturar imagen
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas no disponible");

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Error en canvas");

      // Ajustar tamaño del canvas
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      // Dibujar imagen
      ctx.drawImage(img, 0, 0);

      // Convertir a archivo
      canvas.toBlob((blob) => {
        if (blob) {
          const filename = `camara-ip-${Date.now()}.jpg`;
          const file = new File([blob], filename, { type: "image/jpeg" });
          onCapture(file);
          setCameraError(null);
        } else {
          setCameraError("Error al procesar la imagen");
        }
        setIsCapturing(false);
      }, "image/jpeg", 0.9);

    } catch (error) {
      console.error("Error captura cámara:", error);
      setCameraError("Error al conectar con la cámara IP");
      setIsCapturing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Botón principal */}
      <div className="flex items-center gap-2">
        <button
          onClick={captureFromCamera}
          disabled={disabled || isCapturing}
          className={`
            border rounded px-3 py-2 transition-colors text-sm flex items-center gap-1
            ${isCapturing 
              ? 'bg-yellow-100 animate-pulse cursor-not-allowed' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          title={isCapturing ? "Capturando..." : "Capturar desde cámara IP"}
        >
          {isCapturing ? "📷⏳" : "📹"}
          <span className="hidden sm:inline">
            {isCapturing ? "Capturando..." : "Cámara IP"}
          </span>
        </button>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Config
        </button>
      </div>

      {/* Panel de configuración */}
      {showConfig && (
        <div className="border rounded p-3 bg-gray-50 dark:bg-gray-800/50">
          <div className="text-sm font-medium mb-2">URL de Cámara IP</div>
          <input
            type="text"
            value={cameraUrl}
            onChange={(e) => setCameraUrl(e.target.value)}
            placeholder="http://192.168.255.190/capture"
            className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-gray-900"
          />
          <div className="text-xs text-gray-500 mt-1">
            Ejemplos: /snapshot.jpg, /mjpeg/1, :8080/video
          </div>
        </div>
      )}

      {/* Mostrar errores */}
      {cameraError && (
        <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-600">
          📷 {cameraError}
          <button 
            onClick={() => setCameraError(null)}
            className="ml-2 underline"
          >
            ✕
          </button>
        </div>
      )}

      {/* Canvas oculto */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}