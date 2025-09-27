import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ success: true, messages: [] });
}

export async function POST(request: Request) {
  // handle suggestion logic
  return NextResponse.json({ success: true });
}