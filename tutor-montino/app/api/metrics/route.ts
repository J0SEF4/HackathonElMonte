import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    eficiencia: 0.18,
    calidad: 0.27,
    bienestar: 0.12,
    replicabilidad: true,
  });
}