import dbConnect from "@/lib/dbConnect";
import { User } from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt  from 'bcryptjs'
export async function POST(params:NextRequest){
    try {
        await dbConnect();

        const {email , password , confirmPassword , name}= await params.json();

        if(!email || !password || !confirmPassword || !name){
            return new Response(JSON.stringify({message : "All fields are required"}), {status: 400})
        }

        if(password !== confirmPassword){
            return NextResponse.json({
                message : "Check password again",
            } , { status : 400});
        }

        const existUser  = await User.findOne({email});
        if(existUser){
            return NextResponse.json({
                message : "User already exists",
            } , { status : 400});
        }

        const hash = await bcrypt.hash(password , 10);
        
        const newUser = new User({
            email,
            password : hash ,
            fullName : name,
        });

        await newUser.save();
        
        return NextResponse.json({
            message : "User created successfully !"
        } , {status : 200})
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({
            message : "InternalServer Error !",
            error : error
        } , {status : 200})  
    }
}