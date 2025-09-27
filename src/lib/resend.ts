// src/lib/resend.ts
import { Resend } from "resend";

export function getResendInstance() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing. Set it in your environment variables.");
  }
  return new Resend(process.env.RESEND_API_KEY);
}
