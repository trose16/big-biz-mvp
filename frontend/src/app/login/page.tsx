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

    //JSX (UI Structure)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Container for centering content and background */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        {/* White box with padding, rounded corners, shadow, max width */}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
        {/* Title with Tailwind classes for size, weight, margin, alignment, color */}
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {/* Conditionally renders error message if 'error' state is not empty */}
        <form onSubmit={handleLogin}>
          {/* Form element, onSubmit calls our handleLogin function */}
          <div className="mb-4">
            {/* Div for input grouping with margin-bottom */}
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            {/* Label with Tailwind classes */}
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="admin"
              value={username} // Controlled component: input value tied to state
              onChange={(e) => setUsername(e.target.value)} // Updates state on change
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            {/* Flex container for button alignment */}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  
}