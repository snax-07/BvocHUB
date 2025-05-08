import NextAuth from 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
  _id : string
    email : string
    fullName : string
    id : string
  }

  interface Session{
    user : {
      email : string
      fullName : string
      id : string
    }& DefaultSession['User']
  }
}


declare module 'next-auth/JWT' {
  interface JWT {
      email : string
      fullName : string
      id : string
  }
}