"use client";

export default function VerificadorPage() {
  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Historial Verificador de Confianza</h2>
      <p className="text-sm opacity-75">Acá se encuentra el historial de los chats en Modo Verificador que es la IA que sugiere mejoras y da correcciones si es necesario.</p>
    <div className="min-h-[80vh] flex flex-col items-center bg-white dark:bg-black py-10 px-2">
        <div className="bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-lg w-full max-w-md text-center">
          <span className="text-2xl">💬</span>
          <div className="font-semibold text-lg text-black dark:text-white mt-2">No hay chats guardados aún</div>
          <div className="text-sm text-black/60 dark:text-white/60">Tus conversaciones aparecerán aquí cuando uses el chat.</div>
        </div>
    </div>
    </div>
  );
}

