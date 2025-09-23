import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { is } from "zod/locales";


export async function POST (request:Request){
    await dbConnect();
    try {
        const {username, code} =await request.json()
        const decodedUsername = decodeURIComponent(username)
       const user = await UserModel.findOne( {username: decodedUsername})

       if(!user) {
         return Response.json(
            {
            success: false,
            message: "User not found"
        },
        {
            status: 500
        }
    )
       }

       const isCodeValid = user.verifyCode === code
    const isCodeNotExpired = new Date(user.verifiedCodeExpiry) > new Date ()
       if(isCodeValid && isCodeNotExpired){
        user.isVerified = true
        await user.save()

         return Response.json(
            {
            success: true,
            message: "Account verified sucessfully"
        },
        {
            status: 200
        }
    )
       } else if( !isCodeNotExpired){ {
        return Response.json(
            {
            success: false,
            message: "verify code expired , please sign up again"
        },
        {
            status: 400
        }
    )
       }
    }else {
        return Response.json(
            {
            success: false,
            message: "Incorrect verify code"
        },
        {
            status: 500
        }
    )
    }
    } catch (error) {
          console.error( 'Error in verify code', error);
        return Response.json(
            {
            success: false,
            message: "Error in verify code"
        },
        {
            status: 500
        }
    )
    }

}

