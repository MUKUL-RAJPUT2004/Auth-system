/** @type {import("next").NextConfig} */

import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel.js";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


await connect();    //we can remove it as we have added connect() as in the global context in the dbConfig.ts file

export async function POST(request: NextRequest) {
    try {

        const reqBody = request.json();
        const { username, email, password } = await reqBody;
        console.log(reqBody);

        //check if user exists
        console.log("checking if user exists");
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }

        //check password
        console.log("checking password");
        
        const passwordMatch = await bcryptjs.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        //create token data
        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username
        }
        //create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
            expiresIn: "1d" // 1 day
        });

        const response = NextResponse.json({
            message: "Login Successful",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true,
        })

        return response;

    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 }); 

    }
}