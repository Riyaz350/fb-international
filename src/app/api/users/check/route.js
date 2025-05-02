import { NextResponse } from "next/server";

import user from "../model";
import dbConnect from "../../lib/dbconnect";

export async function POST(req) {
    try {
        await dbConnect();
        const { mobile, email, nid } = await req.json();

        const existingMobile = await user.findOne({ mobile });
        const existingEmail = await user.findOne({ email });
        const existingNID = await user.findOne({ nid });

        if (existingMobile || existingEmail || existingNID) {
            return NextResponse.json({
                exists: true,
                mobile: !!existingMobile,
                email: !!existingEmail,
                nid: !!existingNID
            }, { status: 400 });
        }

        return NextResponse.json({
            exists: false
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            error: "Failed to check existing data",
            details: error.message 
        }, { status: 500 });
    }
} 
