"use client";

import React from "react";

export function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(1, value));
  const percent = Math.round(clamped * 100);
  return (
    <div className="w-full h-3 rounded bg-black/10 dark:bg-white/10 overflow-hidden">
      <div
        className="h-full bg-blue-600"
        style={{ width: `${percent}%` }}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
    </div>
  );
}