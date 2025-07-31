// Updated interfaces to match your actual API response

import type { Category } from "./CategoryType";


export interface Brand {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  costPrice: string;
  sellingPrice: string;
  discountPrice?: string | null;
  stockQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  unit: string;
  taxRate: string;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  category?: Category;
  categoryId: string;
  brand?: Brand;
  brandId: string;
}

export interface ProductResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

