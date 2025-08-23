"use client";

interface TranscriptionOverlayProps {
  isListening: boolean;
  currentText: string;
  onClose: () => void;
}

export default function TranscriptionOverlay({ 
  isListening, 
  currentText, 
  onClose 
}: TranscriptionOverlayProps) {
  if (!isListening) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-8">
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="fixed top-8 right-8 text-white/70 hover:text-white text-4xl transition-colors z-10"
      >
        ×
      </button>

      {/* Texto de transcripción */}
      <div className="text-center max-w-4xl w-full">
        {currentText ? (
          <div className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight tracking-wide animate-in fade-in duration-300">
            {currentText}
          </div>
        ) : (
          <div className="text-2xl text-white/50 animate-pulse">
            Esperando...
          </div>
        )}
      </div>

      {/* Indicador de grabación */}
      <div className="fixed bottom-8 left-8 flex items-center gap-3">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-white/70 text-sm">Grabando</span>
      </div>
    </div>
  );
}