import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    steps: [
      "Identificar tipo de decreto",
      "Reunir antecedentes",
      "Redactar considerandos y vistos",
      "Definir resuelvo",
      "Revisión y firma",
    ],
  });
}