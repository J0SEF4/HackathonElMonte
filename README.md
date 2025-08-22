# Hackathon-ElMonte

## Autores
- Josefa Fernández
- Gonzalo Sandoval

## Descripción
Tutor Montino es una aplicación web diseñada para capacitar y empoderar a los funcionarios municipales mediante un asistente de IA que guía, verifica y gamifica el aprendizaje de tareas administrativas. Incluye funcionalidades como **Modo Aprendiz**, **Verificador de Confianza** y un **Panel de Logros Personales**.

---

## Instalación y Ejecución

1. Clonar el repositorio y entrar a la carpeta del proyecto:
```bash
cd tutor-montino
```
2. Instalar dependencias:
```bash
npm install
```
3. Ejecutar la aplicación:
```bash
npm run dev
```
4.Abrir en el navegador:
```bash
 http://localhost:3000
```

## Tecnologías utilizadas
### Frontend
- Next.js 15 (App Router), React 18, TypeScript
- Tailwind CSS (tema base, Geist Fonts)
- Web Speech API: SpeechRecognition (dictado) y speechSynthesis (TTS)
- Fetch API (cliente) y componentes UI propios (ProgressBar, KpiCard, Badge)
### Backend
- Next.js API Routes (app/api/*) sobre Node.js (TypeScript)
- OpenAI SDK v4 (Responses API) integrado en /api/chat
- Fallback local si falta OPENAI_API_KEY
### Base de datos
- No hay DB aún (estado en memoria/UI). Opciones sugeridas: PostgreSQL + Prisma, Supabase, Turso (SQLite), MongoDB.
### IA
- OpenAI gpt-4o-mini (texto; preparado para visión)
- Diseño por modos: Aprendiz (guía) y Verificador (chequeo)
- Hacer .env.local y ahi colocar: OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
### Voz y Visión
- Voz: Web Speech API (navegador)
- Imagen: input <file> (preview); pendiente enviar la imagen real al modelo
### Otros / DevOps
- npm, ESLint, Turbopack (build), variables .env.local
- Rutas API: /api/chat, /api/verify, /api/plan, /api/achievements, /api/metrics
- Despliegue sugerido: Vercel (o Docker opcional)
- Autenticación pendiente (sugerido: Auth.js / OIDC/SAML municipal)

## Funcionalidades principales
- Modo Aprendiz: guía paso a paso en la creación de documentos administrativos.
- Verificador de Confianza: revisión de borradores y sugerencias de mejora mediante IA.
- Panel de Logros Personales: gamificación del aprendizaje con insignias y puntos.
- Dashboard de métricas: seguimiento de eficiencia, calidad y bienestar laboral.

## Próximos pasos
- Implementación IA
- Bienestar: check-in de bienestar y recordatorios de derechos laborales (UI + lógica).
- Persistencia: DB (PostgreSQL + Prisma) para guardar chats, logros, métricas y perfiles.
- Autenticación: Auth.js (email/municipal SSO) y roles (funcionario/admin).
- Verificador avanzado: adjuntar .doc/.pdf, validaciones normativas, checklist y reportes descargables.
- Logros reales: calcular y persistir progreso/insignias por usuario.
- Métricas reales: instrumentar KPIs (tiempos, errores, satisfacción) y gráficos históricos.
- Observabilidad: logs estructurados, manejo de errores, rate limiting.
- Despliegue: Vercel/Docker + variables de entorno y README de despliegue.
- Contenido: cargar “perfiles de cargo” y flujos procedimentales (guías del Modo Aprendiz).
- i18n y accesibilidad: mejoras de idioma/español formal y accesibilidad (voz/teclado).
