// frontend/src/app/admin/products/page.tsx
'use client'; // <-- Enables client-side logic

import { useState, useEffect } from 'react'; // <-- React Hooks for state and side effects
import { useRouter } from 'next/navigation'; // <-- Next.js Hook for navigation
import axios from 'axios'; // <-- HTTP client for API calls to the backend



// Define the Product content type for TypeScript, matching my backend postgres DB model
interface Product {
  id: string;
  name: string;
  sku: string;
  brand?: string; // Optional properties
  description?: string;
  price?: number;
  imageUrl?: string;
  category?: string;
  isActive?: boolean;
}

export default function AdminProductsPage() {
  // State variables to manage component data and UI status
  const [products, setProducts] = useState<Product[]>([]); // Array to store fetched products
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [error, setError] = useState<string | null>(null); // Error message state
  const router = useRouter(); // Initialize Next.js router for redirects

  // useEffect Hook: Runs side effects (like data fetching or auth checks) after render
  useEffect(() => {
    console.log('---------useEffect: Running auth check and data fetch...---------');

    const fetchProducts = async () => {
      // Authentication Check
      console.log('---------fetchProducts: Checking for token...---------');
      const token = localStorage.getItem('adminToken'); // Get token from local storage
      if (!token) {
        console.log('---------fetchProducts: No token found. Redirecting to login.---------');
        // If no token, redirect to login page (user is not allowed to login)
        router.push('/login');
        return; // Stop login if not authenticated
      }
     console.log('---------fetchProducts: Token found. Attempting to fetch products.---------');

      try {
        // Get Products from Backend API
        console.log('---------fetchProducts: Making API call to:', `${process.env.NEXT_PUBLIC_API_URL}/products`);
        const response = await axios.get<Product[]>(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          headers: {
            Authorization: token, // Attach the authorization token to the request
          },
        });
        console.log('---------fetchProducts: API call successful. Response data:', response.data);
        setProducts(response.data); // Update state with fetched products
        setLoading(false); // Set loading to false once data is fetched
        setError(null); // Clear any previous errors
        console.log('---------fetchProducts: State updated with products.');
      } catch (err: any) {
        // Error Handling during API call
        console.error('---------Error! Failed to fetch products:', err);
        setError('Failed to load products. Please try again.'); // Set error message
        setLoading(false); // Set loading to false even on error
        console.log('---------fetchProducts: State updated with error and loading=false.');

        // Optionally, if the error is 401 Unauthorized, redirect to login
        if (err.response?.status === 401) {
            alert('Session expired or unauthorized. Please log in again.');
            localStorage.removeItem('adminToken'); // Clear invalid token
            router.push('/login');
        }
      }
    };

    fetchProducts(); // Call the async function to fetch products
  }, [router]); // This dependency means the effect re-runs if router object changes, which is rare for stable router.
                // For a simple case, an empty dependency array `[]` can be used so it runs once on mount.

    const handleLogout = () => {
        console.log('handleLogout: Attempting to log out.');
        localStorage.removeItem('adminToken');
        alert('Logged out successfully!');
        router.push('/login');
        console.log('handleLogout: Token removed, redirected to login.');
  };
  
  }
