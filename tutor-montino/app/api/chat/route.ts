import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  let mode: string = "aprendiz";
  let message: string = "";
  let imageFile: File | null = null;

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    mode = String(form.get("mode") || "aprendiz");
    message = String(form.get("message") || "");
    const image = form.get("image");
    if (image && image instanceof File) {
      imageFile = image;
    }
  } else {
    const bodyUnknown: unknown = await req.json().catch(() => ({}));
    const body = bodyUnknown as { mode?: string; message?: string };
    mode = body.mode || "aprendiz";
    message = body.message || "";
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const reply = fallbackReply(mode, imageFile?.name || null, message);
    return NextResponse.json({ reply, mode });
  }

  const openai = new OpenAI({ apiKey });

  const systemPrompt =
    mode === "aprendiz"
      ? "Eres Tutor Montino, un asistente que forma a funcionarios municipales. Guía con preguntas paso a paso, explica el porqué de cada elemento y da ejemplos prácticos. No hagas el trabajo completo sin antes enseñar el proceso. Si recibes una imagen de un documento, analízala y guía al funcionario sobre cómo mejorarla o completarla."
      : "Eres Verificador de Confianza para documentos municipales. Revisa y valida borradores de decretos, resoluciones y otros documentos administrativos: analiza vistos, considerandos, resuelvo, ortografía y formato. Señala mejoras puntuales y posibles riesgos legales. Si recibes una imagen de un documento, analízala detalladamente.";

  try {
    // Preparar el contenido del mensaje
    const messageContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [];

    // Agregar texto si existe
    if (message) {
      messageContent.push({
        type: "text",
        text: message
      });
    }

    // Agregar imagen si existe
    if (imageFile) {
      // Convertir imagen a base64
      const arrayBuffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const mimeType = imageFile.type || 'image/jpeg';
      
      messageContent.push({
        type: "image_url",
        image_url: {
          url: `data:${mimeType};base64,${base64}`,
          detail: "high" // Para análisis detallado de documentos
        }
      });
    }

    // Si no hay contenido, agregar mensaje por defecto
    if (messageContent.length === 0) {
      messageContent.push({
        type: "text",
        text: "Hola, ¿en qué puedo ayudarte?"
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: messageContent
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const replyText = response.choices[0]?.message?.content || "No se recibió respuesta del modelo.";
    
    return NextResponse.json({ reply: replyText, mode });
  } catch (error) {
    console.error("Error al procesar con OpenAI:", error);
    const reply = fallbackReply(mode, imageFile?.name || null, message) +
      "\n\n(Nota: hubo un problema contactando al proveedor de IA, se muestra una respuesta local.)";
    return NextResponse.json({ reply, mode });
  }
}

function fallbackReply(mode: string, imageName: string | null, message: string) {
  let reply = "";
  
  if (mode === "aprendiz") {
    reply = [
      "¡Hola! Soy Tutor Montino y te ayudaré a crear documentos municipales.",
      "",
      "Para empezar, necesito que me digas:",
      "1) ¿Qué tipo de documento necesitas crear? (decreto, resolución, ordinanza, etc.)",
      "2) ¿Cuál es el tema o asunto principal?",
      "3) ¿Tienes algún borrador o documento de referencia?",
      "",
      "También puedes adjuntar una imagen de un documento existente para analizarlo juntos."
    ].join("\n");
  } else if (mode === "verificador") {
    if (imageName && message) {
      reply = `Perfecto, he recibido tu imagen "${imageName}" y tu mensaje. Voy a analizar el documento y te daré mis observaciones sobre:\n\n`;
    } else if (imageName) {
      reply = `He recibido la imagen "${imageName}". Analizando el documento...\n\n`;
    } else {
      reply = "Soy el Verificador de Confianza. Para ayudarte mejor:\n\n";
    }
    
    const checks = [
      "✓ Estructura formal (Vistos, Considerandos, Resuelvo)",
      "✓ Referencias normativas correctas",
      "✓ Claridad en las resoluciones",
      "✓ Ortografía y formato",
      "✓ Aspectos legales y procedimentales"
    ];
    reply += `Revisaré los siguientes aspectos:\n${checks.join("\n")}`;
    
    if (!imageName && !message) {
      reply += "\n\nPor favor, adjunta una imagen del documento o pega el texto que quieres que revise.";
    }
  } else {
    reply = "Modo no reconocido. Por favor selecciona 'Aprendiz' o 'Verificador'.";
  }

  if (imageName && !message) {
    reply += `\n\n📎 Imagen adjunta: ${imageName}`;
  }

  return reply;
}