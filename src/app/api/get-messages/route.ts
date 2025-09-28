/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

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

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const messagesData = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!messagesData || messagesData.length === 0) {
      return Response.json(
        { success: false, message: "No messages found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, messages: messagesData[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to get messages:", error);
    return Response.json(
      { success: false, message: "Failed to get messages" },
      { status: 500 }
    );
  }
}
