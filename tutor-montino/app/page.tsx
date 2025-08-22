
export default function Home() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Tutor Montino</h1>
      <p className="text-sm text-black/70 dark:text-white/70 max-w-2xl">
        Asistente que te forma, no te reemplaza. Apoya a los funcionarios municipales
        con guía paso a paso, verificación de confianza, y un panel de logros para
        gamificar el aprendizaje.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a className="border rounded-lg p-4 hover:bg-black/5 dark:hover:bg-white/5" href="/chat">
          <div className="font-medium">Asistente Conversacional</div>
          <div className="text-sm opacity-75">Chat multimodal (voz+visión)</div>
        </a>
        <a className="border rounded-lg p-4 hover:bg-black/5 dark:hover:bg-white/5" href="/aprendiz">
          <div className="font-medium">Modo Aprendiz</div>
          <div className="text-sm opacity-75">Guía procedimental en tiempo real</div>
        </a>
        <a className="border rounded-lg p-4 hover:bg-black/5 dark:hover:bg-white/5" href="/verificador">
          <div className="font-medium">Verificador de Confianza</div>
          <div className="text-sm opacity-75">Valida borradores y sugiere mejoras</div>
        </a>
        <a className="border rounded-lg p-4 hover:bg-black/5 dark:hover:bg-white/5" href="/logros">
          <div className="font-medium">Logros</div>
          <div className="text-sm opacity-75">Insignias y progreso personal</div>
        </a>
        <a className="border rounded-lg p-4 hover:bg-black/5 dark:hover:bg-white/5" href="/analytics">
          <div className="font-medium">Analytics</div>
          <div className="text-sm opacity-75">Métricas de impacto</div>
        </a>
      </div>
    </div>
  );
}
