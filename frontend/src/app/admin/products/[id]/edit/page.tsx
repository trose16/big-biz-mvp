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
  // We'll define state variables and logic here in the next steps.

  // Basic return to show something is rendering for now.
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p>Loading edit page...</p>
    </div>
  );
}