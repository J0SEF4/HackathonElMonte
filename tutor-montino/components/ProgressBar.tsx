"use client";

import React from "react";

export function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(1, value));
  const percent = Math.round(clamped * 100);
  return (
    <div className="w-full h-3 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-blue-400 dark:from-green-600 dark:via-emerald-700 dark:to-blue-700 rounded-full transition-all"
        style={{ width: `${percent}%` }}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
    </div>
  );
}