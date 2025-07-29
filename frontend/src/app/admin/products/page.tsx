// frontend/src/app/admin/products/page.tsx
'use client'; // <-- Enables client-side logic

import { useState, useEffect } from 'react'; // <-- React Hooks for state and side effects
import { useRouter } from 'next/navigation'; // <-- Next.js Hook for navigation
import axios from 'axios'; // <-- HTTP client for API calls to the backend
import Link from 'next/link'; // <-- Link to see individual product details



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

  // --- START DELETE FUNCTION ---
    const handleDeleteProduct = async (productIdToDelete: string) => {
    // User expereince best practice: Confirm before deleting
    const confirmDelete = window.confirm('Are you sure you want to delete this product? This action cannot be undone.');
    if (!confirmDelete) {
      console.log('---------Delete cancelled by user.');
      return; // Stop if user cancels
    }

    console.log('---------handleDeleteProduct: Attempting to delete product with ID:', productIdToDelete, '---');
    setLoading(true); // Show loading state while deleting
    setError(null);   // Clear previous errors

    try {
      // Auth Check: Get token
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        router.push('/login');
        return;
      }
      console.log('---------handleDeleteProduct: Token found. Making DELETE API call.');

      // Make the API call to delete the product
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${productIdToDelete}`, {
        headers: {
          Authorization: token, // Pass the authorization token
        },
      });

      // Successful deletion (return 204 No Content response)
      console.log(`--- Product with ID ${productIdToDelete} deleted successfully. ---`);
      alert('Product deleted successfully!');

      // 5. Refresh the product list on the dashboard
      // Call the fetchProducts function again to get the updated list
      // We need access to fetchProducts, so we'll adjust useEffect in the next step to expose it.
      // For now, we can just reload the window, but we'll refine this.
      window.location.reload(); // Temporary reload, we'll make this smoother!

    } catch (err: any) {
      // Error Handling
      console.error('--- handleDeleteProduct: Failed to delete product:', err.response?.status, err.message, err.response?.data, '---');
      setError(err.response?.data?.message || 'Failed to delete product. Please try again.');
      setLoading(false); // End loading state

      if (err.response?.status === 401) {
          alert('Session expired or unauthorized. Please log in again.');
          localStorage.removeItem('adminToken');
          router.push('/login');
      }
    }
  };
  // --- END handleDeleteProduct FUNCTION ---

    // Log rendering paths
  if (loading) {
    console.log('AdminProductsPage: Rendering loading state...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Loading products...</p>
      </div>
    );
  }

    if (error) {
     // if there is an error page will reload rendering the error state and button to retry, helpful for user experience   
    console.log('AdminProductsPage: Rendering error state...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button onClick={() => {
                console.log('AdminProductsPage: Retry button clicked.');
                window.location.reload();
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> Retry </button>
        </div>
      </div>
    );
  }
  console.log('AdminProductsPage: Rendering product table or "no products" message.');
  console.log('Products currently in state:', products);


// Main render: Display products in a table or give a helpful message if no products are found
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Product Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">No products found. Add some!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Product Name</th>
                  <th className="py-3 px-6 text-left">SKU</th>
                  <th className="py-3 px-6 text-left">Brand</th>
                  <th className="py-3 px-6 text-left">Price</th>
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-left">Active</th>
                  <th className="py-3 px-6 text-center">Actions</th>{/* Text-center for button alignment */}
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <Link href={`/admin/products/${product.id}/view`} // This is the new dynamic URL
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium">{product.name}</Link>
                    </td>
                    <td className="py-3 px-6 text-left">{product.sku}</td>
                    <td className="py-3 px-6 text-left">{product.brand || 'N/A'}</td>
                    <td className="py-3 px-6 text-left">${Number(product.price)?.toFixed(2) || 'N/A'}</td>
                    <td className="py-3 px-6 text-left">{product.category || 'N/A'}</td>
                    <td className="py-3 px-6 text-left">
                        {product.isActive ? (
                            <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">Yes</span>
                        ) : (
                            <span className="bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs">No</span>
                        )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline"> Delete </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );