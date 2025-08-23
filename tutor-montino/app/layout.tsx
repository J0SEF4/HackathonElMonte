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
            <Link href="/" className="font-semibold">Tutor Montino</Link>
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
