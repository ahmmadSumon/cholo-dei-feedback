import  dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/User";
import bcrypt from 'bcryptjs';
import {sendVerificationEmail} from "../../../helper/sendVerificationEmail";
import { success } from "zod";


export async function POST(request : Request) {
    await dbConnect();

    try {
       const {username, email, password} = await request.json()

      const existingUserByName =  await UserModel.findOne({username ,
        isVerified: true
      })

      if(existingUserByName){
        return Response.json({
            success: false,
            message: "Username already exists"
        }, {status: 400})
       }

      const existingUserByEmail = await UserModel.findOne({email})
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      if(existingUserByEmail){
        return Response.json({
            success: false,
            message: "Email already exists"
        }, {status: 400})
      } else{
        const hashedPassword = await bcrypt.hash(password, 10)
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1 )

        const newUser = new UserModel({
            username,
                email,
                password: hashedPassword,
                verifyCode,
                verifiedCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages:[]
         })
        await newUser.save();

      }
        
      //send verification email
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      )
        
        if(!emailResponse.success){{
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }}
         return Response.json({
                success: true,
                message: "User registered successfully. Please check your email for the verification code."
            }, {status: 201})
    } catch (error) {
        console.error("Error in registering User", error);
        return Response.json(
            {success: false,
                message: "Error in registering User"
            },
            {status: 500 }
        )
    }
}

