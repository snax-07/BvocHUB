export const runtime = "nodejs";
import dbConnect from "@/lib/dbConnect";
// import userModel from "@/model/user.model";
import { User } from "@/model/User";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { AxiosError } from "axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        console.log(credentials.email);

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (user && bcrypt.compareSync(credentials.password as string, user.password)) {
          return user;
        }

        // Throwing custom error with message for invalid credentials
        throw new Error("Invalid email or password. Please check your credentials.");
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === "google") {
        await dbConnect();
        console.log(account?.provider);
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) console.log("Existing user : ", existingUser);
        if (user && !existingUser) {
          const hashedPassword = bcrypt.hashSync("password", 10); // Use a real password here
          const newUser = new User({
            username: user.name,
            email: user.email,
            password: hashedPassword,
            orderHistory: [],
            cart: [],
          });
          await newUser.save();
          console.log(newUser);
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.username = user.fullName;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.name = token.username as string;
        session.user.email = token.email as string;
      }
     
      return session;
    },
  }
});

export const { GET, POST } = handlers;
