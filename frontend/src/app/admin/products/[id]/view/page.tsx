// frontend/src/app/admin/products/[id]/view/page.tsx
// frontend/src/app/products/[id]/page.tsx

'use client'; // This component will fetch data and use React Hooks, so it needs to run in the browser.

import { useState, useEffect } from 'react'; // React Hooks: useState for component state, useEffect for side effects (data fetching).
import { useParams } from 'next/navigation'; // useParams for getting the dynamic [id] from the URL.
import axios from 'axios'; // Axios is our HTTP client for making API calls to the backend.
import Link from 'next/link'; // <-- Link to see individual product details

// Define the Product type, matching your backend model for type safety.
interface Product {
  id: string;
  name: string;
  sku: string;
  brand?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  category?: string;
  isActive?: boolean;
}

// Main React functional component for the Product Details page.
export default function ProductDetailPage() {
  // State variables and logic here...
  const [product, setProduct] = useState<Product | null>(null); // To store the fetched product data
  const [loading, setLoading] = useState(true); // To show loading state
  const [error, setError] = useState<string | null>(null); // To show error messages

  const params = useParams(); // Get dynamic route parameters from the URL.
  const productId = Array.isArray(params.id) ? params.id[0] : params.id; // Extract the 'id' from the URL.

    // --- START useEffect hook BLOCK ---
  useEffect(() => {
    // Console logs for tracing the flow in your browser's console.
    console.log('--- ProductDetailPage: useEffect started. Component mounted or productId changed. ---');
    console.log('--- Current productId from URL (from useParams):', productId);

    const fetchProduct = async () => {
      // Initial Checks:
      if (!productId) {
        setError('Product ID not found in URL. Cannot display details.');
        setLoading(false);
        console.log('--- fetchProduct: No productId. Setting error and stopping. ---');
        return;
      }

      // Authentication Check (for this Admin-internal view page):
      const token = localStorage.getItem('adminToken');
      if (!token) {
        // We set an error, but don't redirect here, as this page (in this context)
        // should show an "unauthorized" error rather than forcing a login.
        setError('Authorization required. Please ensure you are logged in to view product details.');
        setLoading(false);
        console.log('--- fetchProduct: No adminToken found. Access denied for this admin view. ---');
        return;
      }
      console.log('--- fetchProduct: Admin token found. Attempting to fetch product details. ---');

      // Data Fetching Logic:
      try {
        setLoading(true); // Set loading true before API call.
        console.log('--- fetchProduct: Making API call to:', `${process.env.NEXT_PUBLIC_API_URL}/products/${productId} ---`);

        const response = await axios.get<Product>(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
          headers: {
            Authorization: token, // Pass the authentication token.
          },
        });

        console.log('--- fetchProduct: API call successful. Fetched product data:', response.data, '---');
        setProduct(response.data); // Update state with fetched product data.
        setLoading(false);
        setError(null); // Clear errors.

      } catch (err: any) {
        // Error Handling:
        console.error('--- ProductDetailPage: Failed to fetch product:', err.response?.status, err.message, err.response?.data, '---');
        setError(err.response?.data?.message || 'Failed to load product details. Please check the ID or try again.');
        setLoading(false);

        if (err.response?.status === 404) {
            setError('Product not found with this ID.');
            console.log('--- fetchProduct: Received 404 for product ID. ---');
        }
        // If it's a 401, we might show an alert, but for this non-login-forced page, just the error message.
      }
    };

    fetchProduct(); // Execute fetch function.
  }, [productId]); // Dependencies: Re-run effect if productId changes.
  // --- END useEffect hook BLOCK ---


  // Conditional Rendering: Show loading state
  if (loading) {
    console.log('--- ProductDetailPage: Rendering loading state... ---');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300">
        <p className="text-white text-lg">Loading product details...</p>
      </div>
    );
  }

  // Conditional Rendering: Show error state
  if (error) {
    console.log('--- ProductDetailPage: Rendering error state... ---');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center"> {/* Added text-center */}
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Conditional Rendering: Handle no product data (e.g., after a 404 error)
  if (!product) {
    console.log('--- ProductDetailPage: No product loaded, showing generic message. ---');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300">
        <p className="text-white text-lg">No product data available or product not found.</p>
      </div>
    );
  }
  // --- END CONDITIONAL RENDERING BLOCKS ---

  // --- !!! ADD THIS FINAL RETURN BLOCK HERE !!! ---
  // This return statement is executed ONLY IF loading is false, error is null, AND product is successfully loaded.
  console.log('--- ProductDetailPage: Rendering fetched product data. ---');
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-blue-200 to-purple-300">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 animate-fade-in">
        {/* Left Side: Product Image */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-96 w-auto object-contain rounded-lg shadow-md"
            />
          ) : (
            <div className="bg-gray-200 flex items-center justify-center rounded-lg w-full h-64 md:h-96 text-gray-500 text-sm">
              No Image Available
            </div>
          )}
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full md:w-1/2 space-y-4 text-gray-800">
          <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
          <p className="text-lg text-gray-600">
            <span className="font-semibold">SKU:</span> {product.sku}
          </p>
          <p className="text-lg text-gray-600">
            <span className="font-semibold">Brand:</span> {product.brand || 'N/A'}
          </p>
          <p className="text-2xl font-bold text-blue-700">${Number(product.price)?.toFixed(2) || 'N/A'}</p>
          
          <p className="text-gray-700 text-base leading-relaxed">{product.description || 'No description provided.'}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Category:</span> {product.category || 'N/A'}
            </p>
            <span className={`py-1 px-3 rounded-full text-xs font-semibold ${
              product.isActive ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
            }`}>
              {product.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Buttons for navigation */}
          <div className="mt-6 flex space-x-4">
            <Link href="/admin/products" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded text-sm transition duration-300">
              Back to Dashboard
            </Link>
            <Link href={`/admin/products/${product.id}/edit`} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm transition duration-300">
              Edit Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}