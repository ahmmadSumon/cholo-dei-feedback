import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from 'next-auth'
import mongoose from "mongoose";

export async function GET (){
     await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user
    
    if(!user || !session?.user){
        
         return Response.json(
            {
            success: false,
            message: "Not authenticated"
        },
        {
            status: 500
        })
    }

    //mongodb aggregation  pipeline optimization
    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const user = await UserModel.aggregate([
            {$match: {id: userId}},
            {$unwind: '$messages'},
            {$sort : {'messages.createdAt': -1}},
            {$group: {_id: '$_id', message: {$push: 'messages'}}}
        ])

        if(!user || user.length === 0){
            return Response.json(
            {
            success: false,
            message: "User not found"
        },
        {
            status: 500
        })
        }
        return Response.json(
            { 
            success: true,
            message: user[0].messages
        },
        {
            status: 500
        })
    } catch (error) {
          console.log("Failed to get message", error)
        return Response.json(
            {
            success: false,
            message: "Failed to get message"
        },
        {
            status: 500
        })
    }
}