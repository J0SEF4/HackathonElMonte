"use client";

export function KpiCard({
  label,
  value,
  suffix = "",
  hint,
}: {
  label: string;
  value: number;
  suffix?: string;
  hint?: string;
}) {
  const percent = Math.round(value * 100);
  return (
    <div className="border rounded p-3 grid gap-2">
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-2xl font-semibold">{percent}{suffix}</div>
      {hint && <div className="text-xs opacity-60">{hint}</div>}
      <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded">
        <div className="h-2 bg-green-600 rounded" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}