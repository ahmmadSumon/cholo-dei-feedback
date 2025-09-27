/* eslint-disable @typescript-eslint/no-explicit-any */
import { getResendInstance } from "@/lib/resend";
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '../types/ApiResponse';


export async function sendVerificationEmail  (
    email: string,
    username: string,
    verifyCode:string
) :Promise<ApiResponse> {
    try {
        const resend = getResendInstance(); // now created at runtime
     await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email - Cholo Dei Feedback',
      react: VerificationEmail({ username, otp: verifyCode }),
    });
      return {success:true, message:"Successfully send verification email" }
    } catch (emailError: any) {
        console.log("Send Verification Email failed ", emailError);
        return {success:false, message:"Failed to send verification email" }
    }
}