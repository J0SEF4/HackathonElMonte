"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  imageUrl?: string;
};

function generateId(): string {
  return Math.random().toString(36).slice(2);
}

const isBrowser = typeof window !== "undefined";
const hasSpeechSynthesis = isBrowser && "speechSynthesis" in window;

type SpeechRecognitionResultLike = ArrayLike<{ transcript: string }>;
interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface ISpeechRecognition {
  lang: string;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEventLike) => void;
  onend: () => void;
  onerror: () => void;
  start: () => void;
  stop: () => void;
}
interface SpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

const SpeechRecognitionCtor: SpeechRecognitionConstructor | null = isBrowser
  ? (() => {
      const win = window as unknown as {
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
        SpeechRecognition?: SpeechRecognitionConstructor;
      };
      return win.webkitSpeechRecognition ?? win.SpeechRecognition ?? null;
    })()
  : null;

export default function ChatPage() {
  const [mode, setMode] = useState<"aprendiz" | "verificador">("aprendiz");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const startListening = () => {
    if (!SpeechRecognitionCtor || listening) return;
    const rec = new SpeechRecognitionCtor();
    rec.lang = "es-ES";
    rec.interimResults = false;
    rec.onresult = (e: SpeechRecognitionEventLike) => {
      const transcript = Array.from(e.results)
        .map((r) => (r as SpeechRecognitionResultLike)[0].transcript)
        .join(" ");
      setInput((prev) => (prev ? prev + " " : "") + transcript);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const speak = (text: string) => {
    if (!hasSpeechSynthesis || !speakReplies) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-ES";
    window.speechSynthesis.speak(utter);
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
      const data: { reply?: string } = await res.json();
      const reply = data.reply ?? "(sin respuesta)";
      const botMsg: ChatMessage = { id: generateId(), role: "assistant", text: reply };
      setMessages((prev) => [...prev, botMsg]);
      speak(reply);
    } catch {
      const botMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        text: "Ocurrió un error al contactar el servidor.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setImageFile(null);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex gap-2 items-center">
        <span className="text-sm">Modo:</span>
        <button
          className={`px-3 py-1 rounded border ${
            mode === "aprendiz" ? "bg-black text-white dark:bg:white dark:text-black" : ""
          }`}
          onClick={() => setMode("aprendiz")}
        >
          Aprendiz
        </button>
        <button
          className={`px-3 py-1 rounded border ${
            mode === "verificador" ? "bg-black text-white dark:bg:white dark:text:black" : ""
          }`}
          onClick={() => setMode("verificador")}
        >
          Verificador
        </button>
        <label className="ml-auto flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={speakReplies}
            onChange={(e) => setSpeakReplies(e.target.checked)}
          />
          Leer respuestas
        </label>
      </div>

      <div className="border rounded p-3 h-[50vh] overflow-auto bg-black/5 dark:bg-white/5">
        {messages.length === 0 && (
          <div className="text-sm opacity-70">
            {mode === "aprendiz"
              ? "Describe qué decreto necesitas y te guiaré paso a paso."
              : "Pega tu borrador y te ayudaré a verificarlo y mejorarlo."}
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
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <div>{m.text}</div>
                {m.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.imageUrl}
                    alt="adjunta"
                    className="mt-2 max-h-40 rounded"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        {imagePreview && (
          <div className="text-xs opacity-70 flex items-center gap-2">
            Imagen adjunta
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="vista previa"
              className="h-10 w-10 object-cover rounded"
            />
            <button className="underline" onClick={() => setImageFile(null)}>
              Quitar
            </button>
          </div>
        )}
        <div className="flex gap-2 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 border rounded px-3 py-2 text-sm bg-transparent"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
          {!listening ? (
            <button
              className="border rounded px-3"
              onClick={startListening}
              disabled={!SpeechRecognitionCtor}
              title={SpeechRecognitionCtor ? "Empezar dictado" : "Dictado no disponible"}
            >
              🎤
            </button>
          ) : (
            <button className="border rounded px-3" onClick={stopListening} title="Detener dictado">
              ⏹
            </button>
          )}
          <button
            className="border rounded px-3 bg-black text-white dark:bg-white dark:text-black"
            onClick={handleSend}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}