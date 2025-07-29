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

     // Make the API call to snag the product by ID
      try {
        setLoading(true); // Set loading to true before the API call
        console.log('fetchProduct: Making API call to:', `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);

        const response = await axios.get<Product>(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
          headers: {
            Authorization: token, // Pass the authentication token for protected route
          },
        });

        console.log('---------fetchProduct: API call successful. Fetched product data:', response.data);
        setProduct(response.data); // Set the fetched product data to state
        setLoading(false); // Loading is complete
        setError(null); // Clear any old errors

      } catch (err: any) {
        // Handle errors during API call using optional chaining '?' to access without crashing if undefined
        console.error('---------EditProductPage: Failed to fetch product:', err.response?.status, err.message, err.response?.data);
        
        setError(err.response?.data?.message || '---------Failed to load product. Please check the ID or try again.');
        setLoading(false); // Loading is complete even if there's an error

        // Specific error handling based on status code
        if (err.response?.status === 401) {
            console.log('---------fetchProduct: Received 401. Session expired. Redirecting to login.');
            alert('Sorry, your session expired or is unauthorized. Please log in again.');
            localStorage.removeItem('adminToken'); // Clear invalid token
            router.push('/login');
        } else if (err.response?.status === 404) {
            // If product is not found, set a specific error message
            setError('Sorry about that! Product not found with this ID. Please check the URL.');
            console.log('---------fetchProduct: Received 404 for product ID.');
        }
      }
    };

    fetchProduct(); // Call the async function when component mounts.
  }, [productId, router]); // Dependency Array:
                         // - productId: Re-run this effect if the ID in the URL changes.
                         // - router: Included for best practice when using router.push inside useEffect.

  // --- END useEffect BLOCK ---

  // Conditional Rendering: Show user the loading state
  if (loading) {
    console.log('--- EditProductPage: Rendering loading state... ---'); // Log to see this path taken
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Loading product details...</p>
      </div>
    );
  }

    
  // Conditional Rendering: Show error state
  if (error) {
    console.log('--- EditProductPage: Rendering error state... ---'); // Log to see this path taken
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => {
                console.log('--- EditProductPage: Retry button clicked. ---');
                window.location.reload(); // Simple reload to re-attempt fetch
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Conditional Rendering: Handle no product data (e.g., after a 404 error but no specific 'error' message yet)
  if (!product) {
    console.log('--- EditProductPage: Loading finished, no error, but product is null/not found. ---');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">No product data available or product not found.</p>
      </div>
    );
  }
 
 
    console.log('--- EditProductPage: Rendering product details... ---'); 


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Product: {product.name}</h1>
        <p>This is where the edit form for product ID: {product.id} will be!</p>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto mt-4">
            {/* Display fetched product data in raw JSON for debugging */}
            {JSON.stringify(product, null, 2)}
        </pre>
      </div>
    </div>
  );
}