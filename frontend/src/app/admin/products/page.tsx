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