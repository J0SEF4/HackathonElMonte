"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import CameraCapture from "../../components/CameraCapture";
import TranscriptionOverlay from "../../components/TranscriptionOverlay";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  imageUrl?: string;
};

function generateId(): string {
  return Math.random().toString(36).slice(2);
}

type SpeechRecognitionResultLike = ArrayLike<{ transcript: string }> & { isFinal?: boolean };
interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface ISpeechRecognition {
  lang: string;
  interimResults: boolean;
  continuous?: boolean;
  onresult: (event: SpeechRecognitionEventLike) => void;
  onend: () => void;
  onerror: (event: Event & { error?: string }) => void;
  onstart?: () => void;
  start: () => void;
  stop: () => void;
}
interface SpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

export default function ChatPage() {
  const [mode, setMode] = useState<"aprendiz" | "verificador">("aprendiz");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState("");
  
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognitionConstructor | null>(null);

  // Inicializar después de la hidratación
  useEffect(() => {
    setIsClient(true);
    
    try {
      // Verificar soporte de Speech Recognition
      const win = window as Window & {
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
        SpeechRecognition?: SpeechRecognitionConstructor;
      };
      const SpeechRecognitionCtor = win.webkitSpeechRecognition || win.SpeechRecognition || null;
      speechRecognitionRef.current = SpeechRecognitionCtor;
      setSpeechSupported(!!SpeechRecognitionCtor);
      
      // Verificar soporte de Speech Synthesis
      setTtsSupported("speechSynthesis" in window);
      
      console.log("Speech Recognition disponible:", !!SpeechRecognitionCtor);
      console.log("Speech Synthesis disponible:", "speechSynthesis" in window);
      
    } catch (error) {
      console.error("Error al verificar capacidades de voz:", error);
      setSpeechSupported(false);
      setTtsSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  // Reiniciar chat cuando cambie el modo
  useEffect(() => {
    setMessages([]);
    setInput("");
    setImageFile(null);
    setSpeechError(null);
    setLiveTranscript("");
    
    // Detener reconocimiento de voz si está activo
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    // Cancelar síntesis de voz si está activa
    if (ttsSupported && isClient) {
      window.speechSynthesis.cancel();
    }
  }, [mode]);

  const startListening = () => {
    if (!speechRecognitionRef.current || listening || !isClient) {
      console.log("No se puede iniciar:", { 
        hasRecognition: !!speechRecognitionRef.current, 
        listening, 
        isClient 
      });
      return;
    }
    
    setSpeechError(null);
    setLiveTranscript("");
    
    try {
      const rec = new speechRecognitionRef.current();
      rec.lang = "es-ES";
      rec.interimResults = true;
      rec.continuous = true;
      
      rec.onstart = () => {
        console.log("Reconocimiento iniciado");
        setListening(true);
      };
      
      rec.onresult = (e: SpeechRecognitionEventLike) => {
        console.log("Resultado recibido:", e);
        try {
          let finalTranscript = "";
          let interimTranscript = "";
          
          for (let i = 0; i < e.results.length; i++) {
            const result = e.results[i] as SpeechRecognitionResultLike;
            const transcript = result[0].transcript;
            
            if (result.isFinal) {
              finalTranscript += transcript + " ";
            } else {
              interimTranscript += transcript;
            }
          }
          
          const currentTranscript = finalTranscript + interimTranscript;
          setLiveTranscript(currentTranscript);
          
          if (finalTranscript) {
            setInput((prev) => (prev + finalTranscript).trim());
          }
          
        } catch (error) {
          console.error("Error procesando resultado:", error);
        }
      };
      
      rec.onend = () => {
        console.log("Reconocimiento terminado");
        setListening(false);
        setLiveTranscript("");
      };
      
      rec.onerror = (event: Event & { error?: string }) => {
        console.error("Error en reconocimiento de voz:", event);
        const errorMsg = event.error || "Error desconocido";
        setSpeechError(`Error: ${errorMsg}`);
        setListening(false);
        setLiveTranscript("");
        
        // Mostrar mensaje específico según el error
        if (errorMsg === "not-allowed") {
          setSpeechError("Permisos de micrófono denegados. Permite el acceso al micrófono.");
        } else if (errorMsg === "no-speech") {
          setSpeechError("No se detectó voz. Intenta hablar más cerca del micrófono.");
        } else if (errorMsg === "audio-capture") {
          setSpeechError("No se pudo acceder al micrófono. Verifica que esté conectado.");
        } else if (errorMsg === "network") {
          setSpeechError("Error de red. Verifica tu conexión a internet.");
        }
      };
      
      recognitionRef.current = rec;
      console.log("Iniciando reconocimiento...");
      rec.start();
      
    } catch (error) {
      console.error("Error al crear reconocimiento:", error);
      setSpeechError("Error al inicializar el reconocimiento de voz");
      setListening(false);
      setLiveTranscript("");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      console.log("Deteniendo reconocimiento...");
      recognitionRef.current.stop();
    }
    setListening(false);
    setLiveTranscript("");
  };

  const speak = (text: string) => {
    if (!ttsSupported || !speakReplies || !isClient) return;
    
    try {
      // Cancelar cualquier síntesis anterior
      window.speechSynthesis.cancel();
      
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "es-ES";
      utter.rate = 0.9;
      utter.pitch = 1;
      utter.volume = 0.8;
      
      utter.onstart = () => console.log("TTS iniciado");
      utter.onend = () => console.log("TTS terminado");
      utter.onerror = (e) => console.error("Error TTS:", e);
      
      window.speechSynthesis.speak(utter);
    } catch (error) {
      console.error("Error en síntesis de voz:", error);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed && !imageFile) return;
    
    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      text: trimmed,
      imageUrl: imagePreview || undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      let res: Response;
      if (imageFile) {
        const fd = new FormData();
        fd.append("mode", mode);
        fd.append("message", trimmed);
        fd.append("image", imageFile);
        res = await fetch("/api/chat", { method: "POST", body: fd });
      } else {
        res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode, message: trimmed }),
        });
      }
      
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }
      
      const data: { reply?: string } = await res.json();
      const reply = data.reply ?? "(sin respuesta)";
      const botMsg: ChatMessage = { id: generateId(), role: "assistant", text: reply };
      setMessages((prev) => [...prev, botMsg]);
      
      // Leer respuesta si está habilitado
      if (speakReplies) {
        speak(reply);
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      const botMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        text: "Ocurrió un error al contactar el servidor. Por favor, intenta nuevamente.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setImageFile(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearSpeechError = () => {
    setSpeechError(null);
  };

  // Renderizar solo después de la hidratación para evitar errores
  if (!isClient) {
    return (
      <div className="grid gap-4 bg-black min-h-screen text-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-sm opacity-70">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay de transcripción minimalista */}
      <TranscriptionOverlay 
        isListening={listening}
        currentText={liveTranscript}
        onClose={stopListening}
      />
      
      <div className="grid gap-4 bg-black min-h-screen text-white" style={{ fontFamily: '"Inter", "SF Pro Display", -apple-system, sans-serif' }}>
        <div className="flex gap-2 items-center flex-wrap p-4">
          <span className="text-sm font-medium">Modo:</span>
          <button
            className={`px-3 py-1 rounded border transition-colors ${
              mode === "aprendiz" 
                ? "bg-white text-black" 
                : "border-gray-600 hover:bg-gray-800"
            }`}
            onClick={() => setMode("aprendiz")}
          >
            Aprendiz
          </button>
          <button
            className={`px-3 py-1 rounded border transition-colors ${
              mode === "verificador" 
                ? "bg-white text-black" 
                : "border-gray-600 hover:bg-gray-800"
            }`}
            onClick={() => setMode("verificador")}
          >
            Verificador
          </button>
          
          {ttsSupported && (
            <label className="ml-auto flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={speakReplies}
                onChange={(e) => setSpeakReplies(e.target.checked)}
              />
              Leer respuestas
            </label>
          )}
        </div>

        {speechError && (
          <div className="bg-red-900/30 border border-red-700 rounded p-3 mx-4 flex items-start gap-2">
            <span className="text-red-400 text-sm flex-1">
              🎤 {speechError}
            </span>
            <button 
              onClick={clearSpeechError}
              className="text-red-400 hover:text-red-200 text-sm underline"
            >
              Cerrar
            </button>
          </div>
        )}

        <div className="h-[50vh] overflow-auto px-4">
          {messages.length === 0 && (
            <div className="text-sm opacity-70 text-center py-8">
              {mode === "aprendiz"
                ? "Describe qué documento necesitas y te guiaré paso a paso. También puedes adjuntar una imagen de un documento existente o capturar desde cámara IP."
                : "Pega tu borrador o adjunta una imagen del documento y te ayudaré a verificarlo y mejorarlo. También puedes usar la cámara IP para capturar documentos."}
            </div>
          )}
          <div className="grid gap-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.role === "user"
                    ? "justify-self-end max-w-[80%]"
                    : "justify-self-start max-w-[80%]"
                }
              >
                <div
                  className={`rounded px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  {m.imageUrl && (
                    <Image
                      src={m.imageUrl}
                      alt="adjunta"
                      className="mt-2 max-h-40 rounded border"
                      width={300}
                      height={200}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-2 p-4">
          {imagePreview && (
            <div className="text-xs opacity-70 flex items-center gap-2 p-2 bg-gray-800 rounded">
              <span>📎 Imagen adjunta:</span>
              <Image
                src={imagePreview}
                alt="vista previa"
                className="h-10 w-10 object-cover rounded border"
                width={40}
                height={40}
              />
              <button 
                className="underline hover:no-underline text-blue-400" 
                onClick={() => setImageFile(null)}
              >
                Quitar
              </button>
            </div>
          )}
          
          <div className="flex gap-2 items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe tu mensaje o pregunta..."
              className="flex-1 border border-gray-600 rounded px-3 py-2 text-sm bg-gray-900 text-white resize-none min-h-[40px] max-h-[120px]"
              rows={1}
            />
            
            <label className="cursor-pointer border border-gray-600 rounded px-3 py-2 hover:bg-gray-800 transition-colors text-sm flex items-center gap-1">
              📎
              <span className="hidden sm:inline">Imagen</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="hidden"
                title="Adjuntar imagen"
              />
            </label>
            
            <CameraCapture 
              onCapture={(file) => setImageFile(file)}
              disabled={listening}
            />
            
            {speechSupported && (
              <>
                {!listening ? (
                  <button
                    className="border border-gray-600 rounded px-3 py-2 hover:bg-gray-800 transition-colors"
                    onClick={startListening}
                    title="Empezar dictado por voz"
                  >
                    🎤
                  </button>
                ) : (
                  <button 
                    className="border border-red-600 rounded px-3 py-2 bg-red-900/30 hover:bg-red-900/50 transition-colors animate-pulse" 
                    onClick={stopListening} 
                    title="Detener dictado - Grabando..."
                  >
                    ⏹️
                  </button>
                )}
              </>
            )}
            
            <button
              className="border rounded px-3 py-2 bg-white text-black hover:bg-gray-200 transition-opacity disabled:opacity-50"
              onClick={handleSend}
              disabled={!input.trim() && !imageFile}
            >
              Enviar
            </button>
          </div>
          
          <div className="text-xs text-gray-400 flex gap-4">
            {speechSupported ? (
              <span className="text-green-500">✅ Reconocimiento de voz disponible</span>
            ) : (
              <span className="text-red-500">❌ Reconocimiento de voz no disponible</span>
            )}
            
            {ttsSupported ? (
              <span className="text-green-500">✅ Síntesis de voz disponible</span>
            ) : (
              <span className="text-red-500">❌ Síntesis de voz no disponible</span>
            )}
            
            <span className="text-blue-400">📹 Cámara IP integrada</span>
          </div>
        </div>
      </div>
    </>
  );
}