import { FaComments, FaGraduationCap, FaCheckCircle, FaTrophy, FaChartBar, FaHeart } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white dark:bg-black py-1 px-1">
      <div className="w-full max-w-4xl mx-auto">
        {/*
        <h1 className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-[#38BDF8] via-[#4ADE80] to-[#FDE68A] bg-clip-text text-transparent drop-shadow-lg">
          Tutor Montino
        </h1>
        */}
        <h1 className="text-4xl font-extrabold text-center mb-2 drop-shadow-lg text-black dark:text-white">
          Tutor Montino
        </h1>
        <p className="text-base text-center text-black dark:text-white mb-8 max-w-2xl mx-auto font-medium">
          Asistente que te forma, no te reemplaza. Apoya a los funcionarios municipales
          con guía paso a paso, verificación de confianza y un panel de logros para
          gamificar el aprendizaje.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <a className="bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center shadow-lg hover:scale-[1.03] transition-transform duration-200 group" href="/chat">
            <FaComments className="text-3xl mb-2 text-[#38BDF8] group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-lg text-black dark:text-white">Asistente Conversacional</div>
            <div className="text-sm text-center text-black/60 dark:text-white/60">Chat multimodal (voz+visión) en Modo Aprendiz/Verificador</div>
          </a>
          <a className="bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center shadow-lg hover:scale-[1.03] transition-transform duration-200 group" href="/aprendiz">
            <FaGraduationCap className="text-3xl mb-2 text-[#4ADE80] group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-lg text-black dark:text-white">Modo Aprendiz</div>
            <div className="text-sm text-center text-black/60 dark:text-white/60">Historial de chats en modo guía procedimental en tiempo real</div>
          </a>
          <a className="bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center shadow-lg hover:scale-[1.03] transition-transform duration-200 group" href="/verificador">
            <FaCheckCircle className="text-3xl mb-2 text-[#38BDF8] group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-lg text-black dark:text-white">Verificador de Confianza</div>
            <div className="text-sm text-center text-black/60 dark:text-white/60">Historial de chats en modo validar borradores y sugerir mejoras</div>
          </a>
          <a className="bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center shadow-lg hover:scale-[1.03] transition-transform duration-200 group" href="/logros">
            <FaTrophy className="text-3xl mb-2 text-[#FDE68A] group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-lg text-black dark:text-white">Logros</div>
            <div className="text-sm text-center text-black/60 dark:text-white/60">Insignias y progreso personal</div>
          </a>
          <a className="bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center shadow-lg hover:scale-[1.03] transition-transform duration-200 group" href="/analytics">
            <FaChartBar className="text-3xl mb-2 text-[#4ADE80] group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-lg text-black dark:text-white">Análitica de Impacto</div>
            <div className="text-sm text-center text-black/60 dark:text-white/60">Métricas de impacto</div>
          </a>
          <a className="bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center shadow-lg hover:scale-[1.03] transition-transform duration-200 group" href="/bienestar">
            <FaHeart className="text-3xl mb-2 text-[#F43F5E] group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-lg text-black dark:text-white">Bienestar y Derechos</div>
            <div className="text-sm text-center text-black/60 dark:text-white/60">Bienestar laboral y recursos sobre derechos laborales</div>
          </a>
        </div>
      </div>
    </div>
  );
}
