import { NextResponse } from "next/server";
import dbConnect from "../lib/dbconnect";



export async function GET() {
    try {
        await dbConnect();
        return NextResponse.json({
          status: "success",
          message: "Database connected successfully",
          env: {
            hasMongoUri: !!process.env.MONGODB_URI,
            mongoUriLength: process.env.MONGODB_URI?.length || 0,
          },
        });
    } catch (error) {
        console.error('Database test error:', error);
        return NextResponse.json({ 
            status: "error",
            message: error.message,
            env: {
                hasMongoUri: !!process.env.MONGODB_URI,
                mongoUriLength: process.env.MONGODB_URI?.length || 0
            }
        }, { status: 500 });
    }
} 