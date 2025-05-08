import dbConnect from "@/lib/dbConnect";
import { Video } from "@/model/User";
import { NextResponse } from "next/server";

export async function GET(){
    try {

        await dbConnect();
        const videos = await Video.find()

        return NextResponse.json({
            message : "Docs fetched succefully",
            videos,
            status : true
        } , {status : 200})
    } catch (error) {
       console.log(error);
       
        return NextResponse.json({
            message : "Internal server error",
            status : false
        } , {status : 500})
    }
    
}