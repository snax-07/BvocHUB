import { Pdf } from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(params:NextRequest){
    try {
        const docs = await Pdf.find();

        return NextResponse.json({
            message : "Docs fetched succefully",
            docs,
            status : true
        } , {status : 200})
    } catch (error) {
        return NextResponse.json({
            message : "Internal server error",
            status : false
        } , {status : 500})
    }
    
}