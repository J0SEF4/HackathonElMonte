"use client";

export function InfoCard({ title, children, tone = "neutral" }: { title: string; children: React.ReactNode; tone?: "neutral" | "success" | "warning" | "danger" }) {
  const toneClass =
    tone === "success" ? "border-green-600/30 bg-green-600/5" :
    tone === "warning" ? "border-amber-600/30 bg-amber-600/5" :
    tone === "danger" ? "border-red-600/30 bg-red-600/5" :
    "border-black/10 dark:border-white/10";
  return (
    <div className={`border rounded p-3 grid gap-2 ${toneClass}`}>
      <div className="font-medium text-sm">{title}</div>
      <div className="text-sm opacity-90">{children}</div>
    </div>
  );
}