// src/app/api/test-db/route.ts (App Router example)

import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect"; // adjust path if needed

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ success: true, message: "DB Connected ✅" });
  } catch (error : any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
