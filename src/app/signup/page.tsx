"use client"; //making it a client side component
import Link from "next/link";
import React, {useEffect} from "react";
import { useRouter } from "next/navigation";        //latest
import axios from "axios";   
import toast from "react-hot-toast";



export default function SignUpPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",
    })

    const [buttonDisabled, setButtonDisabled] = React.useState(false);

    const [loading, setLoading] = React.useState(false);

    const onSignup = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/users/signup", user);
        console.log("Signup success", response.data);
        router.push("/login")
        
      } catch (error: any) {
        console.log("Signup failed", error);

        // toast.error(error.message); //hw
        
      }finally{
        setLoading(false);
      }
    }

    useEffect (()=>{
      if(user.email.length>0 && user.password.length>0 && user.username.length>0){
        setButtonDisabled(false)
      }
      else{
        setButtonDisabled(true);
      }
    },[user])

    return(
     
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-2">
          <h1 className="text-5xl font-bold flex ">{loading? "Processing": "SignUp"}</h1>
          <div className="h-20"></div>
          <hr />
          <label htmlFor="username">Username</label>
          <input
            className="border border-gray-300 p-2 rounded-md mb-4"
            type="text"
            id="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Enter your username"
          />
          <label htmlFor="email">Email</label>
          <input
            className="border border-gray-300 p-2 rounded-md mb-4"
            type="text"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
          />
          <label htmlFor="password">Password</label>
          <input
            className="border border-gray-300 p-2 rounded-md mb-4"
            type="text"
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
            onClick={onSignup}
          >
            {buttonDisabled? "No signup":"SignUp"}
          </button>
          <Link href="/login" className="text-blue-500 hover:underline" >Visit Login Page</Link>
        </div>
     
    )
}