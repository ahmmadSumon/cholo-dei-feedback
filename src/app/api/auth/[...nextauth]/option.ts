import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "../../../../model/User"
import dbConnect from "../../../../lib/dbConnect";
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from "next-auth";


export const authOptions: NextAuthOptions  =  {
   
    providers : [
     CredentialsProvider({
    
    name: "Credentials",
    
    credentials: {
      email: { label: "Email", type: "text"}, 
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials: any) :Promise<any> {
      await dbConnect();
      try {
       const user =  await UserModel.findOne({
          $or:[
            {email: credentials.identifier},
            {username: credentials.identifier}
          ]
        })
        if(!user){
          throw new Error("No user found with the email")
        }
        if(!user?.isVerified){
          throw new Error("Please verify your email to login")
        }
       const isPasswordCorrect =  await bcrypt.compare(credentials.password, user.password)
        if(isPasswordCorrect){
          return user;
        
        }
        else{
            throw new Error("Password is incorrect")
        }
      } catch (error : any) {
        throw new Error(error)
      }
    }
  })
    ]

}