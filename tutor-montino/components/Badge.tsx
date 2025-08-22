"use client";

export function Badge({ name, level }: { name: string; level: number }) {
  return (
    <div className="border rounded p-3 text-sm flex items-center justify-between">
      <span>{name}</span>
      <span className="text-xs opacity-70">Nivel {level}</span>
    </div>
  );
}