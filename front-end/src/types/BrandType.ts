import type { Pagination } from "./APIResponeType";
import type { Product } from "./ProductType";

export interface Brand {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  products: Product[];
  productCount: number;
}


export interface BrandResponse {
  activeBrandCount: number;
  data: Brand[];
  pagination: Pagination;
}

export interface BrandInput {
  name: string,
  description?: string,
  is_active: boolean,
}