import {resend} from '@/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '../types/ApiResponse';


export async function sendVerificationEmail  (
    email: string,
    username: string,
    verifyCode:string
) :Promise<ApiResponse> {
    try {
     await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],
      subject: 'Hello world',
      react: VerificationEmail({ username, otp: verifyCode }),
    });
      return {success:true, message:"Successfully send verification email" }
    } catch (emailError) {
        console.log("Send Verification Email failed ", emailError);
        return {success:false, message:"Failed to send verification email" }
    }
}