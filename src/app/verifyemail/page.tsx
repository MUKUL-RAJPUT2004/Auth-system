"use client"; 

import axios from "axios"
import Link from "next/link"
import React, { useEffect, useState } from "react"

export default function VerifyEmailPage() {
    const [token, setToken] = useState("")
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState(false)
    
    const verifyUserEmail = async() => {
        try {
            await axios.post("/api/users/verifyemail", {token})
            setVerified(true);

        } catch (error: any) {
            setError(true)
            console.log(error.response.data);
        }

    }

    useEffect(() => {
        const urlToken = window.location.search.split('=')[1];
        setToken(urlToken || "");
        console.log("Token from URL:", urlToken);
    }, [])

    useEffect(() => {
       if(token.length > 0){
           verifyUserEmail();
       }   
    }, [token])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-2xl font-bold">Verify Email</h1>
            <h2 className="p-2 bg-orange-700 text-black">
                {token ? `${token}` : "no token"}
            </h2>
            {verified && (
                <div>
                    <h2 className="text-green-500 text-2xl">Email Verified</h2>
                    <Link href="/login">
                        Go to Login         
                    </Link>
                </div>
            )}

             {error && (
                <div>
                    <h2 className="text-red-700 ">Error</h2>
                    
                    
                    
                </div>
            )}

        </div>
    
    )

}