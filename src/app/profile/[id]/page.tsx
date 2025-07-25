"use client"

import User from "@/models/userModel"
import {connect} from "@/dbConfig/dbConfig";
import React, {useState, useEffect} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UserProfile() {
    const router = useRouter();
    const [name, setName] = useState('nothing');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const getProfile = async () => {
        try {
            const response = await axios.get('/api/users/profile');
            console.log("User fetched");
            const userData = response.data?.data;
            if (userData) {
                setName(userData.username || '');
                setEmail(userData.email || '');
                setStatus(userData.isVerified ? "Verified" : "Not Verified");
            } else {
                setName('');
                setEmail('');
                setStatus('Not Verified');
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setName('');
            setEmail('');
            setStatus('Not Verified');
        }
    }

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-2xl font-bold">Profile</h1>
            <hr />
            <div className="h-10"></div>

                <div className="text-2xl"> Name:
                 <span className="p-2 rounded text-black">{name}</span>
                </div>

                <div className="text-2xl"> Email:
                 <span className="p-2 rounded text-black">{email}</span>
                </div>

                <div className="text-2xl"> Status:
                 <span className="p-2 rounded text-black">{status}</span>
                </div>

        </div>
    )
}