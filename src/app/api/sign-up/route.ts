import  dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/User";
import bcrypt from 'bcryptjs';
import {sendVerificationEmail} from "../../../helper/sendVerificationEmail";

  

export async function POST(request : Request) {
    await dbConnect();

    try {
        // Step 2: Get username, email, and password from request body
       const {username, email, password} = await request.json()
// Step 3: Check if username already exists (verified users only)
      const existingUserByName =  await UserModel.findOne({username ,
        isVerified: true
      })

      if(existingUserByName){
        return Response.json({
            success: false,
            message: "Username already exists"
        }, {status: 400})
       }
 // Step 4: Check if email already exists
      const existingUserByEmail = await UserModel.findOne({email})
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  // Email already registered and verified → stop
      if(existingUserByEmail){
        if(existingUserByEmail.isVerified){
             return Response.json({
            success: false,
            message: "user already exists already wih this email"
        }, {status: 400})
        }else{
            // Email exists but not verified → update with new password + code
            const hashedPassword = await bcrypt.hash(password, 10)
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifiedCodeExpiry = new Date(Date.now() + 3600000) // 1 hour from now

            await existingUserByEmail.save();
        }
       
        

      } else{
      //Create new user if email not found
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
       //eturn success message
         return Response.json({
                success: true,
                message: "User registered successfully. Please check your email for the verification code."
            }, {status: 201})
    } catch (error) {
          // Step 8: Handle errors
        console.error("Error in registering User", error);
        return Response.json(
            {success: false,
                message: "Error in registering User"
            },
            {status: 500 }
        )
    }
}

