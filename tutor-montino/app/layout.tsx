import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
//import ThemeToggle from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tutor Montino - TutorIA Municipal",
  description: "Asistente que te forma, no te reemplaza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="w-full bg-white/80 dark:bg-[#101624]/80 shadow-md shadow-black/5 dark:shadow-white/10 border-b border-black/10 dark:border-white/10 backdrop-blur-md">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold flex items-center gap-3 group">
              <span className="rounded-full bg-gradient-to-br from-[#38BDF8] via-[#4ADE80] to-[#FDE68A] p-1 shadow-lg group-hover:scale-105 transition-transform">
                <svg width="25" height="25" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="10" fill="url(#streamer-gradient)" />
                <circle cx="14" cy="15" r="7" fill="#fff" fillOpacity=".97" />
                {/* <circle cx="12" cy="16" r="1" fill="#38BDF8" /> */}
                {/* <circle cx="16" cy="16" r="1" fill="#38BDF8" /> */}
                {/* <path d="M7 15a7 7 0 0 1 14 0" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" fill="none"/> */}
                {/* <rect x="3.5" y="13" width="4" height="7" rx="2" fill="#38BDF8" stroke="#4ADE80" strokeWidth="1"/> */}
                {/* <rect x="20.5" y="13" width="4" height="7" rx="2" fill="#38BDF8" stroke="#4ADE80" strokeWidth="1"/> */}

                {/* Ojos en negro */}
                <circle cx="12" cy="16" r="1" fill="#111" />
                <circle cx="16" cy="16" r="1" fill="#111" />
                {/* Diadema auriculares en negro */}
                <path d="M7 15a7 7 0 0 1 14 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                {/* Auriculares laterales en negro */}
                <rect x="3.5" y="13" width="4" height="7" rx="2" fill="#111" stroke="#111" strokeWidth="1"/>
                <rect x="20.5" y="13" width="4" height="7" rx="2" fill="#111" stroke="#111" strokeWidth="1"/>
                {/* Diadema superior con gradiente */}
                <path d="M7 10c2-4 12-4 14 0" stroke="url(#streamer-gradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                {/* Micrófono: círculo en el mentón y línea desde auricular derecho */}
                {/* Cabeza del micrófono cerca del mentón */}
                <circle cx="15.5" cy="20.2" r="1" fill="#484848" stroke="#000" strokeWidth="0.7"/>
                {/* Línea del micrófono desde el auricular derecho hasta cerca del mentón */}
                <path d="M22 16.5 Q18.5 19.5, 15.5 20.2" stroke="#000" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
                {/*<path d="M22 19c1 1 0 2-1 1.5" stroke="#38BDF8" strokeWidth="1.1" strokeLinecap="round" fill="none"/>*/}
                {/* <circle cx="21" cy="21" r="1" fill="#FDE68A" stroke="#4ADE80" strokeWidth="0.7"/> */}

                <defs>
                  <linearGradient id="streamer-gradient" x1="4" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4ADE80" />
                    <stop offset="0.5" stopColor="#38BDF8" />
                    <stop offset="1" stopColor="#FDE68A" />
                  </linearGradient>
                </defs>
                </svg>
              </span>
              <span className="text-l font-extrabold">
                Tutor Montino
              </span>
            </Link>
            {/*<div className="flex items-center gap-3">*/}
              
            <nav className="flex gap-2 text-sm font-bold">
              {[
                { href: "/chat", label: "Chat" },
                { href: "/aprendiz", label: "Modo Aprendiz" },
                { href: "/verificador", label: "Verificador" },
                { href: "/logros", label: "Logros" },
                { href: "/analytics", label: "Análitica" },
                { href: "/bienestar", label: "Bienestar" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="relative px-2 py-1 text-black dark:text-white transition-colors duration-200 after:content-[''] after:block after:h-[2.5px] after:bg-gradient-to-r after:from-[#38BDF8] after:to-[#FDE68A] after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100 after:origin-left focus:after:scale-x-100"
                  style={{ textDecoration: "none" }}
                >
                  {label}
                </Link>
              ))}
            </nav>
            {/*<ThemeToggle />
            </div>*/}
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
