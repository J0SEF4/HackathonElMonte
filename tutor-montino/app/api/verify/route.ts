import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text } = await req.json().catch(() => ({ text: "" }));
  const ok = typeof text === "string" && text.trim().length > 20;
  return NextResponse.json({ ok, notes: ok ? [] : ["El borrador es muy corto"] });
}