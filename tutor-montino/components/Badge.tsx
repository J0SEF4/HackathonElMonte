"use client";

export function Badge({ name, level }: { name: string; level: number }) {
  let levelBg = "bg-gradient-to-r from-yellow-300 via-green-200 to-emerald-200 dark:from-yellow-700 dark:via-green-800 dark:to-emerald-900";
  if (level === 1) levelBg = "bg-yellow-200 dark:bg-yellow-700";
  if (level === 2) levelBg = "bg-green-200 dark:bg-green-800";
  return (
    <div className="border rounded-xl p-4 flex items-center justify-between shadow-md bg-white/80 dark:bg-gray-900/80 transition-all hover:scale-[1.025] hover:shadow-xl">
      <span className="flex items-center gap-2">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
          <circle cx="12" cy="12" r="10" fill="url(#badge-gradient)" />
          <path d="M12 7l1.902 3.854 4.26.619-3.081 3.003.728 4.244L12 16.02l-3.809 2 .728-4.244-3.081-3.003 4.26-.619z" fill="#fff"/>
          <defs>
            <linearGradient id="badge-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE68A" />
              <stop offset="0.5" stopColor="#4ADE80" />
              <stop offset="1" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
        </svg>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{name}</span>
      </span>
      <span className={`text-xs px-3 py-1 rounded-full font-bold text-gray-800 dark:text-white shadow-sm ${levelBg}`}>Nivel {level}</span>
    </div>
  );
}