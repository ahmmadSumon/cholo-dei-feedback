// /* eslint-disable @typescript-eslint/no-explicit-any */
// import CredentialsProvider from "next-auth/providers/credentials";
// import UserModel from "../../../../model/User";
// import dbConnect from "../../../../lib/dbConnect";
// import bcrypt from "bcryptjs";
// import { NextAuthOptions } from "next-auth";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       id: "credentials",
//       name: "Credentials",
//       credentials: {
//         identifier: { label: "Email or Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials: any): Promise<any> {
//         await dbConnect();
//         try {
//           const user = await UserModel.findOne({
//             $or: [
//               { email: credentials.identifier },
//               { username: credentials.identifier },
//             ],
//           });

//           if (!user) throw new Error("No user found with these credentials");
//           if (!user.isVerified) throw new Error("Please verify your email");

//           const isPasswordCorrect = await bcrypt.compare(
//             credentials.password,
//             user.password
//           );

//           if (!isPasswordCorrect) throw new Error("Password is incorrect");

//           return user;
//         } catch (error: any) {
//           throw new Error(error);
//         }
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token._id = user._id?.toString();
//         token.isVerified = user.isVerified;
//         token.isAcceptingMessages = user.isAcceptingMessages;
//         token.username = user.username;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       if (token) {
//         (session.user as any)._id = token._id;
//         (session.user as any).isVerified = token.isVerified;
//         (session.user as any).isAcceptingMessages = token.isAcceptingMessages;
//         (session.user as any).username = token.username;
//       }
//       return session;
//     },
//   },

//   pages: {
//     signIn: "/sign-in",
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };


/* eslint-disable @typescript-eslint/no-explicit-any */
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "../../../../model/User";
import dbConnect from "../../../../lib/dbConnect";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) throw new Error("No user found with these credentials");
          if (!user.isVerified) throw new Error("Please verify your email");

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) throw new Error("Password is incorrect");

          // ✅ Return plain object with string _id
          return {
            _id: user._id.toString(),
            username: user.username,
            isVerified: user.isVerified,
            isAcceptingMessages: user.isAcceptingMessages,
          };
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id; // Already string from authorize
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      console.log("JWT token:", token);
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
      }
      console.log("Session user:", session.user);
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
