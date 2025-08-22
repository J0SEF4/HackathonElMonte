import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    badges: [
      { id: "primer-decreto", name: "Primer Decreto", level: 1 },
      { id: "verificador-pro", name: "Verificador Pro", level: 2 },
    ],
    progress: 0.4,
  });
}