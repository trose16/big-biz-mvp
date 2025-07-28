// frontend/src/app/admin/add-product/page.tsx
'use client'; // <-- Enables client-side logic so it can run in the browser.

import { useState } from 'react'; // We'll need this to manage form input.
import { useRouter } from 'next/navigation'; // For redirecting after adding a product.
import axios from 'axios'; // For making the API call to your backend.


export default function AddProductPage() {
    // --- START STATE VARIABLES ---
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(''); // Using string for input, will convert to Number for API
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setIsActive] = useState(true); // Boolean for a checkbox, defaulting to true
  const [loading, setLoading] = useState(false); // For showing a loading spinner during API call
  const [error, setError] = useState<string | null>(null); // For displaying API call errors
  const [success, setSuccess] = useState<string | null>(null); // For displaying success message

  const router = useRouter();
  // --- END STATE VARIABLES ---



  // --- START FORM SUBMISSION HANDLER ---
  const handleAddProduct = async (e: React.FormEvent) => {
    console.log('--- FORM SUBMISSION ATTEMPT ---');
    e.preventDefault(); // <-- 1. Prevent default browser form submission (page reload)

    // Clear previous messages and set loading state
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Prep data to send to backend
    // Convert price to a number. parseFloat handles strings like "19.99"
    const productData = {
      name,
      sku,
      brand: brand || undefined, // Send undefined if empty string, so backend doesn't save empty string if column is nullable
      description: description || undefined,
      price: parseFloat(price), // Convert string input to a float number
      imageUrl: imageUrl || undefined,
      category: category || undefined,
      isActive,
    };

    console.log('---------Sending product data:', productData);

    try {
      // Get auth token from local storage
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        router.push('/login'); // Redirect to login if token is missing
        return;
      }
      console.log('Using token:', token); // Debug token

      // 5. Make the API call to backend to add the product
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, productData, {
        headers: {
          Authorization: token, // Pass the authentication token
        },
      });

      // Handle successful response
      console.log('---------Product added!', response.data);
      setSuccess('Product added successfully!');
      
      // Clear form fields after successful submit
      setName('');
      setSku('');
      setBrand('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setCategory('');
      setIsActive(true); // Reset to default active state

      router.push('/admin/products'); // Redirect to the dashboard to show the new product

    } catch (err: any) {
      // Handle errors during API call
      console.error('---------Failed to add product:', err.response?.status, err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to add product. Please check your inputs.');
      
      // If unauthorized, clear token and redirect
      if (err.response?.status === 401) {
          alert('Session expired or unauthorized. Please log in again.');
          localStorage.removeItem('adminToken');
          router.push('/login');
      }
    } finally {
      setLoading(false); // Always set loading to false after the API call finishes
    }
  };
  // --- END FORM SUBMISSION HANDLER ---


  // Basic structure of a React functional component using tailwind styling.
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Product</h1>
        {/* form will go here */}
        {/* Display messages based on state */}
        {loading && <p className="text-blue-500 text-center mb-4">Adding product...</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleAddProduct}> {/* Connects the form submission to function */}
          {/* Input for Product Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Product Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="e.g., Tide Pods"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Input for SKU */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sku">
              SKU (Stock Keeping Unit)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="sku"
              type="text"
              placeholder="e.g., TPODS-ULTRA-OXI-123"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
            />
          </div>

          {/* Input for Brand */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brand">
              Brand
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="brand"
              type="text"
              placeholder="e.g., Tide"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          {/* Input for Description */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              rows={3}
              placeholder="Detailed product description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Input for Price */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Price
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              type="number" // Use type="number" for numeric input, browser helps with validation
              step="0.01"  // Allows for decimal values
              placeholder="e.g., 19.99"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          {/* Input for Image URL */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">
              Image URL
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="imageUrl"
              type="text"
              placeholder="e.g., https://example.com/product.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          {/* Input for Category */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="category"
              type="text"
              placeholder="e.g., Laundry Detergent"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          {/* Checkbox for isActive */}
          <div className="mb-6 flex items-center">
            <input
              className="mr-2 leading-tight"
              id="isActive"
              type="checkbox"
              checked={isActive} // 'checked' for checkbox, not 'value'
              onChange={(e) => setIsActive(e.target.checked)} // 'e.target.checked' for checkboxes
            />
            <label className="text-gray-700 text-sm font-bold" htmlFor="isActive">
              Is Active (Product visible)
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">Add Product</button>
          </div>
        </form>

        {/* Back to dashboard button (optional for now, can be added later) */}
        {/* <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/admin/products')}
            className="text-blue-500 hover:text-blue-700 text-sm font-bold"
          >
            Back to Dashboard
          </button>
        </div> */}
      </div>
    </div>
  );
}