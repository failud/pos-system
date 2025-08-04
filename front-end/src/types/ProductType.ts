// Updated interfaces to match your actual API response

import type { Brand } from "./BrandType";
import type { Category } from "./CategoryType";


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

