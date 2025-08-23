import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

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
        <header className="w-full border-b border-black/10 dark:border-white/10">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="10" fill="url(#streamer-gradient)" />
                <circle cx="14" cy="15" r="7" fill="#fff" fillOpacity=".97" />
                <circle cx="12" cy="16" r="1" fill="#38BDF8" />
                <circle cx="16" cy="16" r="1" fill="#38BDF8" />
                <path d="M7 15a7 7 0 0 1 14 0" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                <rect x="3.5" y="13" width="4" height="7" rx="2" fill="#38BDF8" stroke="#4ADE80" strokeWidth="1"/>
                <rect x="20.5" y="13" width="4" height="7" rx="2" fill="#38BDF8" stroke="#4ADE80" strokeWidth="1"/>
                <path d="M7 10c2-4 12-4 14 0" stroke="url(#streamer-gradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M22 19c1 1 0 2-1 1.5" stroke="#38BDF8" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
                <circle cx="21" cy="21" r="1" fill="#FDE68A" stroke="#4ADE80" strokeWidth="0.7"/>
                <defs>
                  <linearGradient id="streamer-gradient" x1="4" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4ADE80" />
                    <stop offset="0.5" stopColor="#38BDF8" />
                    <stop offset="1" stopColor="#FDE68A" />
                  </linearGradient>
                </defs>
              </svg>
              Tutor Montino
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/chat">Chat</Link>
              <Link href="/aprendiz">Modo Aprendiz</Link>
              <Link href="/verificador">Verificador</Link>
              <Link href="/logros">Logros</Link>
              <Link href="/analytics">Análitica</Link>
              <Link href="/bienestar">Bienestar</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
