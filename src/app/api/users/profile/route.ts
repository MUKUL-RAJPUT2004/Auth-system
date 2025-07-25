import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

await connect();
export async function GET(request: NextRequest) {
    
    try {
        const userId = await getDataFromToken(request);
        const user = await User.findOne({_id: userId}).select("-password");
        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404});
        }
        return NextResponse.json({ data: user }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
        
    }


}