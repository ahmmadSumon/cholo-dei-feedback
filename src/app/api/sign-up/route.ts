import  dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/User";
import bcrypt from 'bcryptjs';
import {sendVerificationEmail} from "../../../helper/sendVerificationEmail";


export async function POST(request : Request) {
    await dbConnect();

    try {
        
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

