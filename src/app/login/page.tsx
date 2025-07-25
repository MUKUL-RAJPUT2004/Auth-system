"use client"; //making it a client side component
import Link from "next/link";
import React, {useEffect} from "react";
import { useRouter } from "next/navigation";        //latest
import axios from "axios";   
import toast from "react-hot-toast";



export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
       
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);

    useEffect(() => {
      if(user.email.length > 0 && user.password.length >0){
          setButtonDisabled(false);
        } else{
          setButtonDisabled(true);
        }
    }, [user]);

    const [loading, setLoading] = React.useState(false);

    const onLogin = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/users/login", user);
        console.log("Login success", response.data);
        toast.success("Login successful!");
        // Redirect to profile after successful login
        router.push("/profile");
        

      } catch (error: any) {
        console.log("Login failed", error);
        // toast.error(error.message); //hw
      } finally {
        setLoading(false);
      }
    }

    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
          <h1 className="text-5xl font-bold">{loading ? "Processing..." : "Login"}</h1>
          <div className="h-20"></div>
          <hr />

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
          onClick={onLogin}
          
          >
            {buttonDisabled? "No Login":"Login"}
          </button>
          <Link href="/signup" className="text-blue-500 hover:underline" >Visit SignUp Page</Link>
        </div>
    )
}