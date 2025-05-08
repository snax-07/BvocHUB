import dbConnect from "@/lib/dbConnect";
import { Video } from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(params:NextRequest){
    try {
        await dbConnect();
        const {url} = await params.json();
        console.log(url);
        
        const video = await Video.findOne({url});

        if(!video) return NextResponse.json({
            message : "Video is not Available!"
        } , {status : 301})
        return NextResponse.json({
            message : "Video fetched successfully !",
            video
        } , {status : 200})
    } catch (error) {
        return NextResponse.json({
            message : "Internal server error"
        } ,{status : 500})
    }
}