import { NextRequest, NextResponse } from "next/server";

export type WellbeingInput = {
  mood: number; // 1-5
  stress: number; // 1-5
  hoursWorked: number; // 0-24
  overtimeHours: number; // 0-24
  breaksTaken: boolean;
  incidentOrHarassment: boolean;
  respect: number; // 1-5
};

export type WellbeingAdvice = {
  title: string;
  message: string;
  tone: "neutral" | "success" | "warning" | "danger";
};

export type WellbeingResult = {
  risk: "low" | "medium" | "high";
  score: number; // 0-100
  advice: WellbeingAdvice[];
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Partial<WellbeingInput>;
  const mood = clamp(body.mood ?? 3, 1, 5);
  const stress = clamp(body.stress ?? 3, 1, 5);
  const hoursWorked = clamp(body.hoursWorked ?? 8, 0, 24);
  const overtimeHours = clamp(body.overtimeHours ?? 0, 0, 24);
  const breaksTaken = Boolean(body.breaksTaken ?? true);
  const incidentOrHarassment = Boolean(body.incidentOrHarassment ?? false);
  const respect = clamp(body.respect ?? 3, 1, 5);

  // Simple heuristic scoring (0 peor, 100 mejor)
  let score = 0;
  score += (mood - 1) * 5; // 0..20
  score += (5 - stress) * 5; // 0..20
  score += breaksTaken ? 10 : 0; // +10 si tomó pausas
  score += Math.max(0, 10 - Math.max(0, hoursWorked - 9) * 2); // penaliza jornadas muy largas
  score += Math.max(0, 10 - overtimeHours * 2); // penaliza sobretiempo
  score += (respect - 1) * 5; // 0..20
  if (incidentOrHarassment) score -= 30;
  score = clamp(Math.round(score), 0, 100);

  const risk: WellbeingResult["risk"] = score >= 70 ? "low" : score >= 40 ? "medium" : "high";

  const advice: WellbeingAdvice[] = [];
  if (!breaksTaken) {
    advice.push({
      title: "Pausas y microdescansos",
      message: "Realiza pausas breves (5-10 min) cada 90 minutos para reducir la fatiga.",
      tone: "warning",
    });
  }
  if (hoursWorked > 10 || overtimeHours >= 2) {
    advice.push({
      title: "Jornada y horas extraordinarias",
      message: "Revisa tu carga laboral y distribúyela. Si hay sobretiempo frecuente, informa a tu jefatura para gestionar prioridades.",
      tone: "warning",
    });
  }
  if (incidentOrHarassment) {
    advice.push({
      title: "Protocolos ante acoso o incidentes",
      message: "Registra el hecho y comunícalo a RR.HH. o la unidad de prevención. Puedes solicitar apoyo y activar protocolos internos.",
      tone: "danger",
    });
  }
  if (stress >= 4) {
    advice.push({
      title: "Gestión de estrés",
      message: "Prueba técnicas breves (respiración 4-7-8, pausas activas) y pide apoyo para ajustar plazos o cargas.",
      tone: "warning",
    });
  }
  if (risk === "low") {
    advice.push({
      title: "Bienestar estable",
      message: "Sigue con hábitos saludables: pausas, hidratación, comunicación abierta y límites claros de jornada.",
      tone: "success",
    });
  }

  return NextResponse.json({ risk, score, advice } satisfies WellbeingResult);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}