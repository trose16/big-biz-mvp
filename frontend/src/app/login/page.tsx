// frontend/src/app/login/page.tsx
'use client'; // This directive makes this a Client Component in Next.js App Router

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous error

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                username,
                password,
            });

            // If login is successful and returns a token 
            const token = response.data.token;
            localStorage.setItem('adminToken', token);
            alert("Good news! Login successful!"); //Let the user know they are logged in
            router.push('/admin/products'); // Redirect to the admin dashboard where they can manage products
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed. Please check your username and password.");
            console.error("Login error:", err);
        }
    };

  
}