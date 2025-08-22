import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  let mode: string = "aprendiz";
  let message: string = "";
  let imageName: string | null = null;

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    mode = String(form.get("mode") || "aprendiz");
    message = String(form.get("message") || "");
    const image = form.get("image");
    if (image && typeof image === "object" && "name" in image) {
      imageName = (image as File).name;
    }
  } else {
    const bodyUnknown: unknown = await req.json().catch(() => ({}));
    const body = bodyUnknown as { mode?: string; message?: string };
    mode = body.mode || "aprendiz";
    message = body.message || "";
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const reply = fallbackReply(mode, imageName, message);
    return NextResponse.json({ reply, mode });
  }

  const openai = new OpenAI({ apiKey });

  const systemPrompt =
    mode === "aprendiz"
      ? "Eres Tutor Montino, un asistente que forma al funcionario. Guía con preguntas, explica el porqué y da ejemplos. No hagas el trabajo completo sin antes enseñar el proceso."
      : "Eres Verificador de Confianza. Revisa y valida borradores de decretos: vistos, considerandos, resuelvo, ortografía y formato. Señala mejoras puntuales y riesgos.";

  const userPrompt = [
    imageName ? `Se adjunta una imagen (${imageName}).` : null,
    message || "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const input = `Sistema: ${systemPrompt}\n\nUsuario: ${userPrompt || "(sin texto)"}`;

  try {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input,
    });
    const replyText = ("output_text" in response ? (response as { output_text?: string }).output_text : undefined) ||
      "No se recibió texto de respuesta.";
    return NextResponse.json({ reply: replyText, mode });
  } catch {
    const reply = fallbackReply(mode, imageName, message) +
      "\n(Nota: hubo un problema contactando al proveedor de IA, se muestra una respuesta local.)";
    return NextResponse.json({ reply, mode });
  }
}

function fallbackReply(mode: string, imageName: string | null, message: string) {
  let reply = "";
  if (mode === "aprendiz") {
    reply = [
      "Perfecto. Te voy a guiar para crear tu decreto.",
      "1) ¿Cuál es el tipo de decreto? (p.ej., nombramiento, pago, licitación)",
      "2) ¿Qué antecedentes respalda? (documentos, fechas, normativa)",
      "3) ¿Cuál es el objetivo del ‘Resuelvo’?",
      "Cuando me respondas, te doy el siguiente paso y ejemplos.",
    ].join("\n");
  } else if (mode === "verificador") {
    const checks = [
      "Revisa ‘Vistos’ y ‘Considerandos’ (normas y antecedentes completos).",
      "Valida el ‘Resuelvo’ (acciones claras, plazos, responsable).",
      "Ortografía y formato (numeración, mayúsculas, firmas).",
    ];
    reply = `Análisis inicial de tu borrador:\n- ${checks.join("\n- ")}`;
  } else {
    reply = "Modo no reconocido. Usa ‘aprendiz’ o ‘verificador’.";
  }

  if (imageName) {
    reply += `\nTambién recibí una imagen: ${imageName}.`;
  }

  if (!message && !imageName) {
    reply += "\n(Pista: envía un mensaje o adjunta una imagen)";
  }
  return reply;
}