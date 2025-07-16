"use client"; //making it a client side component
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast/headless";
import router, { useRouter } from "next/navigation"
import React, {useState} from "react";
import { link } from "fs";

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState("nothing");
    const logout = async () => {
        try {
            await axios.get('api/users/logout')
            toast.success("Logout successful");
            // Redirect to the login page after successful logout
            router.push('/login')
        } catch (error: any) {
            console.error("Logout failed", error);
            // You can handle the error here, e.g., show a toast notification
            toast.error("Logout failed: " + error.message);
            
        }
    }

    const getUserDetails = async () => {
        const res = await axios.get('/api/users/me')
        console.log(res.data);
        setData(res.data.data._id)
        
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-2xl font-bold">Profile</h1>
            <hr />
            
            <p> Profile Page</p>
            <h2 className="p-1 rounded bg-green-300 ">{data === 'nothing'?"Nothing": <Link href={`/profile/${data}`}>{data}
            </Link>}</h2>

            <hr />
            <button
            className="bg-red-500 text-white py-2 px-4 m-2 rounded"
            onClick={logout}
            >Logout</button>

             <button
            className="bg-green-500 text-white py-2 px-4 m-2 rounded"
            onClick={getUserDetails}
            >GetUserDetails</button>

        </div>
    )
}