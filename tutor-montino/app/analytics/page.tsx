"use client";

import { useEffect, useState } from "react";
import { KpiCard } from "@/components/KpiCard";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ eficiencia: number; calidad: number; bienestar: number; replicabilidad: boolean } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/metrics");
        const json = await res.json();
        setData(json);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (

    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Análitica de Impacto</h2>
      <p className="text-sm text-black/60 dark:text-white/60 mb-6">Visualiza el impacto de la herramienta en eficiencia, calidad y bienestar.</p>

      {loading && <div className="text-sm opacity-70">Cargando...</div>}
      {!loading && data && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCard label="Eficiencia" value={data.eficiencia} suffix="%" hint="% reducción tiempo promedio tareas" />
          <KpiCard label="Calidad" value={data.calidad} suffix="%" hint="% menos errores documentales" />
          <KpiCard label="Bienestar" value={data.bienestar} suffix="%" hint="Mejora satisfacción y salud mental" />
        </div>
      )}
    </div>
  );
}