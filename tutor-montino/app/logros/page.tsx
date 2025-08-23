"use client";

import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { Badge } from "@/components/Badge";

type BadgeItem = { id: string; name: string; level: number };

export default function LogrosPage() {
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/achievements");
        const data: { badges: BadgeItem[]; progress: number } = await res.json();
        setBadges(data.badges || []);
        setProgress(data.progress || 0);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="grid gap-4">
  <h2 className="text-xl font-semibold">Logros</h2>
  <p className="text-sm text-black/60 dark:text-white/60 mb-4">¡Desbloquea insignias y sigue tu progreso personal!</p>
      <div className="grid gap-2">
        <div className="text-sm font-bold">Progreso general</div>
        <ProgressBar value={progress} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {loading ? (
          <div className="text-sm opacity-70">Cargando...</div>
        ) : badges.length === 0 ? (
          <div className="text-sm opacity-70">Aún no tienes insignias.</div>
        ) : (
          badges.map((b) => <Badge key={b.id} name={b.name} level={b.level} />)
        )}
      </div>
    </div>
  );
}