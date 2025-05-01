import { createUser } from "./controller";
import dbConnect from "../lib/dbConnect";
import { NextResponse } from "next/server";


export async function GET(req) {
    try {
        await dbConnect();
        return NextResponse.json({ message: "Database connected successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to connect to the database" }, { status: 500 });
    }
}


export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const user = await createUser(body);
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}


