// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/option";
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import {User} from 'next-auth'


// export async function POST (request:Request){
//     await dbConnect();
//     const session = await getServerSession(authOptions)
//     const user: User = session?.user as { _id: string } & any
    
//     if(!user || !session?.user || !user._id){
        
//          return Response.json(
//             {
//             success: false,
//             message: "Not authenticated"
//         },
//         {
//             status: 401
//         })
//     }
//     const userId = user._id
//     const {acceptMessage} = await request.json()

//     try {
//         const updatedUser =  await UserModel.findByIdAndUpdate(
//             userId,
//             {isAcceptingMessages: acceptMessage},
//             {new: true}
//         )
//         if(!updatedUser){
//             return Response.json(
//             {
//             success: false,
//             message: "Failed to update user status to accept message"
//         },
//         {
//             status: 401
//         })
//         }
//           return Response.json(
//             {
//             success: true,
//             message: "Message acceptance status updated successfully",
//             updatedUser
//         },
//         {
//             status: 200
//         })
        
//     } catch (error) {
//         console.log("Failed to update user status to accept message", error)
//         return Response.json(
//             {
//             success: false,
//             message: "Failed to update user status to accept message"
//         },
//         {
//             status: 500
//         })
//     }
// } 

// export async function GET(){
//    await dbConnect();
//     const session = await getServerSession(authOptions)
//     const user: User = session?.user
    
//     if(!user || !session?.user){
        
//          return Response.json(
//             {
//             success: false,
//             message: "Not authenticated"
//         },
//         {
//             status: 500
//         })
//     }
//     const userId = user._id
//     try {
//          const foundUser = await UserModel.findById(userId)

//     if(!foundUser){
//         return Response.json(
//             {
//             success: false,
//             message: "User Not Found"
//         },
//         {
//             status: 500
//         })
//     }
//      return Response.json(
//             {
//             success: true,
//             isAcceptingMessages: foundUser.isAcceptingMessages
//         },
//         {
//             status: 500
//         })
//     } catch (error) {
//           console.log("Failed to update user status to accept message", error)
//         return Response.json(
//             {
//             success: false,
//             message: "Error in getting accept message status"
//         },
//         {
//             status: 500
//         })
//     }

   

// }

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user as { _id: string } & any;

  if (!user?._id) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const { acceptMessage } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { isAcceptingMessages: acceptMessage },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { success: false, message: "Failed to update status" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated",
        isAcceptingMessages: updatedUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update user status:", error);
    return Response.json(
      { success: false, message: "Failed to update user status" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user as { _id: string } & any;

  if (!user?._id) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, isAcceptingMessages: foundUser.isAcceptingMessages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting accept message status:", error);
    return Response.json(
      { success: false, message: "Error in getting status" },
      { status: 500 }
    );
  }
}
