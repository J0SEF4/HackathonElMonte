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
  /*return (
    <div className="border rounded p-3 grid gap-2">
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-2xl font-semibold">{percent}{suffix}</div>
      {hint && <div className="text-xs opacity-60">{hint}</div>}
      <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded">
        <div className="h-2 bg-green-600 rounded" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );*/
  return (
    <div className="border rounded-xl p-5 grid gap-2 shadow-lg bg-white/80 dark:bg-gray-900/80 transition-all hover:scale-[1.025] hover:shadow-2xl">
      <div className="text-xs opacity-70 tracking-wide font-medium mb-1">{label}</div>
      <div className="text-3xl font-extrabold text-green-700 dark:text-green-400 flex items-end gap-1">
        {percent}<span className="text-lg font-semibold">{suffix}</span>
      </div>
      {hint && <div className="text-xs opacity-60 mb-1">{hint}</div>}
      <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-blue-400 dark:from-green-600 dark:via-emerald-700 dark:to-blue-700 rounded-full transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );

}