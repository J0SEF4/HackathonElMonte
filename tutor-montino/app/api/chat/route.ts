import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message, mode } = await req.json();

  let systemPrompt = "Eres un asistente municipal experto en trámites.";
  if (mode === "decreto") {
    systemPrompt = "Eres un asistente municipal experto en decretos. Ayuda a redactar, revisar y explicar decretos municipales de forma clara y precisa.";
  } else if (mode === "formulario") {
    systemPrompt = "Eres un asistente municipal experto en formularios. Ayuda a crear, completar y revisar formularios municipales.";
  } else if (mode === "reporte") {
    systemPrompt = "Eres un asistente municipal experto en reportes. Ayuda a redactar y analizar reportes municipales.";
  } else if (mode === "aprendiz") {
    systemPrompt = "Eres un tutor municipal que guía paso a paso en cualquier trámite, documento o proceso municipal.";
  } else if (mode === "verificador") {
    systemPrompt = "Eres un verificador experto que revisa y sugiere mejoras en documentos municipales.";
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
  model: "meta-llama/llama-3.1-405b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 800,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      return NextResponse.json({ reply: `Error de OpenRouter: ${response.status} - ${errorText}` });
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("Respuesta inesperada de OpenRouter:", JSON.stringify(data));
      return NextResponse.json({ reply: "No se pudo generar respuesta (respuesta inesperada de la IA)." });
    }
    const reply = data.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error al contactar OpenRouter:", error);
    return NextResponse.json({ reply: "Error al contactar OpenRouter. Revisa tu API key y conexión a internet." });
  }
}
/*import { NextRequest, NextResponse } from "next/server";
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
}*/