"use client";

import { useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { InfoCard } from "@/components/InfoCard";

export default function BienestarPage() {
  const [form, setForm] = useState({
    mood: 3,
    stress: 3,
    hoursWorked: 8,
    overtimeHours: 0,
    breaksTaken: true,
    incidentOrHarassment: false,
    respect: 3,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    risk: "low" | "medium" | "high";
    score: number;
    advice: { title: string; message: string; tone: "neutral" | "success" | "warning" | "danger" }[];
  }>(null);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/wellbeing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="grid gap-6">
        <h2 className="text-xl font-semibold">Bienestar laboral y derechos</h2>
      </div>
      <div className="grid lg:grid-cols-2 gap-8 mx-auto mt-4">
        {/* Columna izquierda: Check-in */}
        <div className="grid bg-white/80 border border-blue-100 rounded-2xl shadow-sm p-6">
          <div className="flex gap-2 min-h-[28px] text-base font-semibold text-blue-800">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" stroke="#38bdf8" strokeWidth="2"/><path d="M7 10l2 2 4-4" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <strong>Check-in de Bienestar</strong>
          </div>
          <div className="grid gap-3 border border-blue-100 rounded-xl p-4 bg-blue-50/40">
            <NumberField
              label="Ánimo (1-5)"
              min={1}
              max={5}
              value={form.mood}
              onChange={(n) => setForm({ ...form, mood: n })}
            />
            <NumberField
              label="Estrés (1-5)"
              min={1}
              max={5}
              value={form.stress}
              onChange={(n) => setForm({ ...form, stress: n })}
            />
            <NumberField
              label="Horas trabajadas hoy"
              min={0}
              max={24}
              value={form.hoursWorked}
              onChange={(n) => setForm({ ...form, hoursWorked: n })}
            />
            <NumberField
              label="Horas extra hoy"
              min={0}
              max={24}
              value={form.overtimeHours}
              onChange={(n) => setForm({ ...form, overtimeHours: n })}
            />
            <CheckboxField
              label="Tomé pausas"
              checked={form.breaksTaken}
              onChange={(v) => setForm({ ...form, breaksTaken: v })}
            />
            <CheckboxField
              label="Hubo incidente o acoso"
              checked={form.incidentOrHarassment}
              onChange={(v) => setForm({ ...form, incidentOrHarassment: v })}
            />
            <NumberField
              label="Clima de respeto (1-5)"
              min={1}
              max={5}
              value={form.respect}
              onChange={(n) => setForm({ ...form, respect: n })}
            />
            <button
              onClick={submit}
              disabled={loading}
              className="justify-self-start border border-blue-400 rounded-lg px-4 py-1.5 text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2"><svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fff" strokeOpacity=".3" strokeWidth="4"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="4"/></svg>Evaluando...</span>
              ) : "Evaluar"}
            </button>
          </div>

          {result && (
            <div className="grid gap-3 mt-4">
              <div className="flex items-center gap-2 min-h-[28px] text-base font-semibold text-blue-800">
                <svg width="18" height="18" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" stroke="#38bdf8" strokeWidth="2"/><path d="M10 5v5l3 3" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <strong>Resultado</strong>
              </div>
              <div className="grid gap-2">
                <div className="text-sm">Puntaje: <span className="font-bold text-blue-900">{result.score}/100</span></div>
                <ProgressBar value={result.score / 100} />
                <div className="text-sm">Riesgo: <span className={
                  result.risk === "low" ? "text-green-600 font-bold" :
                  result.risk === "medium" ? "text-yellow-600 font-bold" : "text-red-600 font-bold"
                }>{result.risk === "low" ? "Bajo" : result.risk === "medium" ? "Medio" : "Alto"}</span></div>
              </div>
              <div className="grid gap-2">
                {result.advice.map((a, i) => (
                  <InfoCard key={i} title={a.title} tone={a.tone}>{a.message}</InfoCard>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha: Derechos y recursos */}
        <div className="grid gap-6 bg-white/80 border border-green-100 rounded-2xl shadow-sm p-6">
          <div className="flex gap-2 min-h-[28px] text-base font-semibold text-green-800">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="2" y="2" width="16" height="16" rx="4" stroke="#22c55e" strokeWidth="2"/><path d="M7 10l2 2 4-4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <strong>Derechos y recursos</strong>
          </div>
          <InfoCard title={<span className="font-bold">Jornada y descansos</span>} tone="neutral">
            <span className="block mb-1">Referencia general: jornada ordinaria y descansos. Considerar normativa aplicable al sector municipal.</span>
            <span className="block">Revisa orientaciones y actualizaciones en sitios oficiales.</span>
          </InfoCard>
          <InfoCard title={<span className="font-bold">Prevención de riesgos (Ley 16.744)</span>} tone="neutral">
            <span className="block mb-1">Cobertura de accidentes del trabajo y enfermedades profesionales.</span>
            <span className="block">Ante incidentes, informa a tu jefatura y al organismo administrador.</span>
          </InfoCard>
          <InfoCard title={<span className="font-bold">Acoso laboral y sexual</span>} tone="neutral">
            <span className="block mb-1">Existen procedimientos y medidas de resguardo. Registra y reporta.</span>
            <span className="block">Consulta protocolos internos y normativa aplicable.</span>
          </InfoCard>
          <InfoCard title={<span className="font-bold">Teletrabajo y desconexión</span>} tone="neutral">
            <span className="block mb-1">Para modalidades a distancia, revisar condiciones, seguridad y derecho a desconexión.</span>
          </InfoCard>
          <div className="grid gap-2 text-sm mt-2">
            <div className="font-medium font-bold">
              Enlaces de referencia (oficiales):
            </div>
            <ul className="list-disc pl-5 space-y-1">
              <li><a className="underline text-green-700 hover:text-green-900" href="https://www.bcn.cl" target="_blank" rel="noreferrer">Biblioteca del Congreso Nacional (BCN)</a></li>
              <li><a className="underline text-green-700 hover:text-green-900" href="https://www.gob.cl" target="_blank" rel="noreferrer">Gobierno de Chile</a></li>
              <li><a className="underline text-green-700 hover:text-green-900" href="https://www.dt.gob.cl" target="_blank" rel="noreferrer">Dirección del Trabajo</a></li>
              <li><a className="underline text-green-700 hover:text-green-900" href="https://www.superir.gob.cl" target="_blank" rel="noreferrer">Superintendencia de Seguridad Social</a></li>
            </ul>
            <div className="opacity-60 text-xs mt-1">Esta información es orientativa; verifica la normativa vigente y los reglamentos internos municipales.</div>
          </div>
        </div>
      </div>
    </div>
  );
}


function NumberField({ label, value, onChange, min, max }: { label: string; value: number; onChange: (n: number) => void; min: number; max: number }) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      <span className="opacity-90">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-blue-200 rounded-lg px-2 py-1 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
      />
    </label>
  );
}


function CheckboxField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-blue-500 w-4 h-4" />
      <span className="opacity-90">{label}</span>
    </label>
  );
}