"use server"
import { auth } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import { Video } from '@/model/User';
import {v2  as cloudinary} from 'cloudinary'
import { NextRequest, NextResponse } from 'next/server';

cloudinary.config({
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET,
    cloud_name : process.env.CLOUD_NAME
});


type cloudinaryUploadResult = {
    public_id : string,
    [key : string ] : any
}
export async function POST(req : NextRequest) {
    try {
        const session = await auth();
        if(!session?.user) return NextResponse.json({ message : "Unauthenticated " , status : false} , {status : 403});
        
        await dbConnect();

        const form = await req.formData();
        const file = form.get("file") as File | null;

        if(!file) return NextResponse.json({message : "Video is not uploaded !"});
        const title = form.get("title"); 
        const des = form.get('des');
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const response = await new Promise<cloudinaryUploadResult>((resolve , reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder : "BcocHubDoc",
                resource_type : "video"
            } , (error , result) => {
                if(error) reject(error)
                else resolve(result as cloudinaryUploadResult);
            });
             uploadStream.end(buffer);
        })

        const newDoc = new Video({
            title,
            description : des,
            url : response.url,
            duration : response.duration,
            uploader : session?.user.name
        });

        await newDoc.save();

        return NextResponse.json({
            message : "Video is uploaded Successfully!",
            status : true
        } , {status : 200})
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({
            message : "Internal server error"
        } , {status : 500})
    }
}