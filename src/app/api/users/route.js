import  dbConnect  from "@/app/api/lib/dbconnect";

export async function GET(request) {
    try {
        const db = await dbConnect();
        return new Response(JSON.stringify({ 
            message: "MongoDB is connected!" 
        }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ 
            message: "Failed to connect to MongoDB", 
            error: error.message 
        }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}