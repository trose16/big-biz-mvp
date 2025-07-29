// frontend/src/app/admin/products/[id]/view/page.tsx
// frontend/src/app/products/[id]/page.tsx

'use client'; // This component will fetch data and use React Hooks, so it needs to run in the browser.

import { useState, useEffect } from 'react'; // React Hooks: useState for component state, useEffect for side effects (data fetching).
import { useParams } from 'next/navigation'; // useParams for getting the dynamic [id] from the URL.
import axios from 'axios'; // Axios is our HTTP client for making API calls to the backend.

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

  // Basic return to show something is rendering.
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300">
      <p className="text-white text-lg">Loading product details...</p>
    </div>
  );
}