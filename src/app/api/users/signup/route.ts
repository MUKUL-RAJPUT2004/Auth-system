import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel.js";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest){
    await connect();
    try {
        const reqBody = await request.json();
        const {username, email, password} = reqBody;

        console.log(reqBody);
        console.log("in try block");

        //check if user exist
        console.log("checking if user exists");
        
        const user = await User.findOne({email});
        if(user){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }
        console.log("user does not exist, creating new user");
        

        //hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        console.log("password hashed successfully");

        //save user
        const newUser= new User({
            username,
            email,
            password: hashedPassword
        })
        console.log("new user created", newUser);

        //save user
        const savedUser = await newUser.save();
        console.log(savedUser);
        console.log("User saved successfully");
        
        //send verification email
        await sendEmail({
            email: savedUser.email,
            emailType: "VERIFY",
            userId: savedUser._id
        })

        return NextResponse.json({
            message: "User saved successfully",
            success: true,
            savedUser
        })
        
        
    } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
}
}