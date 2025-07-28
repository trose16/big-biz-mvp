// frontend/src/app/admin/products/page.tsx
'use client'; // <-- Enables client-side logic so it can run in the browser.

import { useState, useEffect } from 'react'; // <-- React Hooks for state and side effects
import { useRouter, useParams } from 'next/navigation'; // <-- Next.js Hooks: useRouter for navigation, useParams for dynamic route segments (like [id]).
import axios from 'axios'; // <-- HTTP client for API calls to the backend

// This interface defines the expected shape of our Product data.
// It helps TypeScript ensure type safety and autocompletion.
interface Product {
  id: string;
  name: string;
  sku: string;
  brand?: string; // Properties with '?' are optional
  description?: string;
  price?: number;
  imageUrl?: string;
  category?: string;
  isActive?: boolean;
}

// Main React functional component for the Edit Product page.
export default function EditProductPage() {
  // --- START STATE VARIABLES AND HOOKS ---
  const [product, setProduct] = useState<Product | null>(null); // Loading state for data fetching (NULL at first).
  const [loading, setLoading] = useState(true); // State to indicate if data is currently being loaded. Starts as true.
  const [error, setError] = useState<string | null>(null); // Error message state. Initially null.
  const router = useRouter(); // Hook to access router object for navigation (e.g., redirecting).
  const params = useParams(); // Hook to get dynamic route parameters from the URL.

  // Get 'id' from URL params. Matches folder named '[id]', so the param will be 'id' then convert it to string as URL params are always strings.
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // --- END ADDED STATE VARIABLES AND HOOKS ---

  // --- Start useEffect BLOCK --- NOTES: useEffect is for "side effects" like data fetching that need to run after a component renders
  useEffect(() => {
    console.log('---------EditProductPage: useEffect started. Component mounted or productId changed.');
    console.log('---------Current productId from URL (from useParams):', productId);

    const fetchProduct = async () => {
       console.log('---------fetchProduct: Starting to fetch product data...');
      // If productId is somehow not available from the URL, show an error and stop.
      if (!productId) {
        setError('---------Product ID not found in URL. Cannot edit.');
        setLoading(false); // Stop loading as there's nothing to fetch
        console.log('---------fetchProduct: No productId. Setting error and stopping.');
        return;
      }

      // Authentication Check:
      const token = localStorage.getItem('adminToken'); // Get the token from local storage.
      if (!token) {
        console.log('---------fetchProduct: No auth token found. Redirecting to login.');
        router.push('/login'); // If no token, send user back to the login page.
        return; 
      }
      console.log('---------fetchProduct: Authentication token found.');

      setLoading(false); // NOTE: reset to true before the actual API call is made.
    };

    fetchProduct(); // Call the async function when the component mounts.
  }, [productId, router]); // Dependency Array:
                         // - productId: Re-run this effect if the ID in the URL changes.
                         // - router: Included for best practice when using router.push inside useEffect.

  // --- END useEffect BLOCK ---

  // Basic return to show something is rendering for now.
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p>Loading edit page, edit fx coming soon...</p>
    </div>
  );
}